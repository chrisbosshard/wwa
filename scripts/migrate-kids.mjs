/**
 * Migrates families and kids from Hygraph to Directus without touching
 * categories or wishes. Maps wish/donor relations via existing Directus data.
 *
 * Usage: npm run migrate:kids
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

const HYGRAPH_URL = process.env.HYGRAPH_URL;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;
const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

async function hygraph(query, variables = {}) {
  const res = await fetch(HYGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function directusLogin() {
  if (process.env.DIRECTUS_TOKEN) return process.env.DIRECTUS_TOKEN;

  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const { data } = await res.json();
  return data.access_token;
}

async function directus(token, method, path, body) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function importAsset(token, url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const baseName = url.split("/").pop()?.split("?")[0] || "asset";
    const form = new FormData();
    form.append("file", new Blob([buffer], { type: contentType }), baseName);
    const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!uploadRes.ok) return null;
    const { data } = await uploadRes.json();
    return data.id;
  } catch {
    return null;
  }
}

async function ensureHygraphIdField(token, collection) {
  try {
    await directus(token, "GET", `/fields/${collection}/hygraph_id`);
  } catch {
    await directus(token, "POST", `/fields/${collection}`, {
      field: "hygraph_id",
      type: "string",
      meta: {
        interface: "input",
        hidden: true,
        readonly: true,
        note: "Original Hygraph record ID for migration idempotency",
      },
      schema: { is_unique: true, is_nullable: true },
    });
    console.log(`  ✓ Added ${collection}.hygraph_id`);
  }
}

async function buildWishIdMap(token) {
  const { data: directusWishes } = await directus(
    token,
    "GET",
    "/items/wish?limit=-1&fields=id,description"
  );
  const byDescription = new Map(
    directusWishes.map((wish) => [wish.description?.trim(), wish.id])
  );

  const wishIdMap = {};
  let skip = 0;
  while (true) {
    const { wishes } = await hygraph(
      `query($skip: Int!) {
        wishes(first: 100, skip: $skip) { id description }
      }`,
      { skip }
    );
    if (!wishes?.length) break;

    for (const wish of wishes) {
      const directusId = byDescription.get(wish.description?.trim());
      if (directusId) wishIdMap[wish.id] = directusId;
    }
    skip += 100;
  }

  console.log(`Mapped ${Object.keys(wishIdMap).length} wishes to Directus records`);
  return wishIdMap;
}

async function buildDonorIdMap(token) {
  const { data: existingDonors } = await directus(
    token,
    "GET",
    "/items/donor?limit=-1&fields=id,email,hygraph_id"
  );
  const byHygraphId = new Map(
    existingDonors.filter((d) => d.hygraph_id).map((d) => [d.hygraph_id, d.id])
  );
  const byEmail = new Map(
    existingDonors.filter((d) => d.email).map((d) => [d.email.toLowerCase(), d.id])
  );

  const donorIdMap = { ...Object.fromEntries(byHygraphId) };
  let skip = 0;
  let created = 0;

  while (true) {
    const { donors } = await hygraph(
      `query($skip: Int!) {
        donors(first: 100, skip: $skip) {
          id titel prename surname address zipcode city email public numberOfGifts paymentSuccessful
          logo { url }
        }
      }`,
      { skip }
    );
    if (!donors?.length) break;

    for (const donor of donors) {
      if (donorIdMap[donor.id]) continue;

      const existingId = donor.email ? byEmail.get(donor.email.toLowerCase()) : null;
      if (existingId) {
        donorIdMap[donor.id] = existingId;
        await directus(token, "PATCH", `/items/donor/${existingId}`, { hygraph_id: donor.id });
        continue;
      }

      const logoId = await importAsset(token, donor.logo?.url);
      const { data: createdDonor } = await directus(token, "POST", "/items/donor", {
        titel: donor.titel,
        prename: donor.prename,
        surname: donor.surname,
        address: donor.address,
        zipcode: donor.zipcode,
        city: donor.city,
        email: donor.email,
        public: donor.public,
        number_of_gifts: donor.numberOfGifts,
        payment_successful: donor.paymentSuccessful,
        logo: logoId,
        hygraph_id: donor.id,
      });
      donorIdMap[donor.id] = createdDonor.id;
      created++;
    }
    skip += 100;
  }

  console.log(`Mapped ${Object.keys(donorIdMap).length} donors (${created} created)`);
  return donorIdMap;
}

async function loadFamilyIdMap(token) {
  const { data: families } = await directus(
    token,
    "GET",
    "/items/family?limit=-1&fields=id,hygraph_id,email"
  );
  return {
    byHygraphId: new Map(families.filter((f) => f.hygraph_id).map((f) => [f.hygraph_id, f.id])),
    byEmail: new Map(families.filter((f) => f.email).map((f) => [f.email.toLowerCase(), f.id])),
  };
}

async function loadExistingKids(token) {
  const { data: kids } = await directus(
    token,
    "GET",
    "/items/kid?limit=-1&fields=id,hygraph_id,prename,wish.description"
  );
  return {
    byHygraphId: new Map(kids.filter((k) => k.hygraph_id).map((k) => [k.hygraph_id, k.id])),
    unmatched: kids.filter((k) => !k.hygraph_id),
  };
}

async function upsertFamily(token, family, familyMaps) {
  if (!family) return null;

  if (familyMaps.byHygraphId.has(family.id)) {
    return familyMaps.byHygraphId.get(family.id);
  }

  const emailKey = family.email?.toLowerCase();
  if (emailKey && familyMaps.byEmail.has(emailKey)) {
    const existingId = familyMaps.byEmail.get(emailKey);
    await directus(token, "PATCH", `/items/family/${existingId}`, { hygraph_id: family.id });
    familyMaps.byHygraphId.set(family.id, existingId);
    return existingId;
  }

  const imageId = await importAsset(token, family.image?.url);
  const { data: createdFamily } = await directus(token, "POST", "/items/family", {
    prename: family.prename,
    surname: family.surname,
    street: family.street,
    nr: family.nr,
    zipcode: family.zipcode,
    city: family.city,
    email: family.email,
    phone: family.phone,
    comment: family.comment,
    leginr: family.leginr,
    origin: family.origin,
    contact_permission: family.contactPermission,
    image: imageId,
    hygraph_id: family.id,
  });

  familyMaps.byHygraphId.set(family.id, createdFamily.id);
  if (emailKey) familyMaps.byEmail.set(emailKey, createdFamily.id);
  return createdFamily.id;
}

function findUnmatchedKid(existingKids, kid, wishIdMap) {
  const wishDescription = kid.wish?.description?.trim();
  const directusWishId = kid.wish ? wishIdMap[kid.wish.id] : null;

  return existingKids.unmatched.find((existing) => {
    if (existing.prename !== kid.prename) return false;
    const existingWishDescription = existing.wish?.description?.trim();
    if (wishDescription && existingWishDescription) {
      return existingWishDescription === wishDescription;
    }
    return !wishDescription && !existingWishDescription;
  });
}

async function migrateKids(token, wishIdMap, donorIdMap) {
  const familyMaps = await loadFamilyIdMap(token);
  const existingKids = await loadExistingKids(token);

  let after = null;
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let familiesCreated = 0;
  const familiesSeen = new Set();

  while (true) {
    const data = await hygraph(
      `query($after: String) {
        kidsConnection(first: 100, after: $after, orderBy: id_DESC) {
          edges { cursor node {
            id prename age active checkout completed code createdAt
            family {
              id prename surname street nr zipcode city email phone comment leginr origin contactPermission
              image { url }
            }
            wish { id description } donor { id }
          }}
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { after }
    );

    const conn = data.kidsConnection;

    for (const { node: kid } of conn.edges) {
      if (existingKids.byHygraphId.has(kid.id)) {
        skipped++;
        continue;
      }

      let familyId = null;
      if (kid.family) {
        const before = familyMaps.byHygraphId.size;
        familyId = await upsertFamily(token, kid.family, familyMaps);
        if (familyMaps.byHygraphId.size > before || !familiesSeen.has(kid.family.id)) {
          if (!familiesSeen.has(kid.family.id) && familyId) familiesCreated++;
          familiesSeen.add(kid.family.id);
        }
      }

      const wishId = kid.wish ? wishIdMap[kid.wish.id] : null;
      if (kid.wish && !wishId) {
        console.warn(`  ! No Directus wish match for kid ${kid.prename}: ${kid.wish.description}`);
      }

      const donorId = kid.donor ? donorIdMap[kid.donor.id] : null;
      const payload = {
        prename: kid.prename,
        age: kid.age,
        active: kid.active,
        checkout: kid.checkout,
        completed: kid.completed,
        code: kid.code,
        family: familyId,
        wish: wishId,
        donor: donorId,
        hygraph_id: kid.id,
      };

      const unmatched = findUnmatchedKid(existingKids, kid, wishIdMap);
      if (unmatched) {
        await directus(token, "PATCH", `/items/kid/${unmatched.id}`, payload);
        if (kid.createdAt) {
          await directus(token, "PATCH", `/items/kid/${unmatched.id}`, {
            date_created: kid.createdAt,
          });
        }
        existingKids.byHygraphId.set(kid.id, unmatched.id);
        existingKids.unmatched = existingKids.unmatched.filter((k) => k.id !== unmatched.id);
        updated++;
        continue;
      }

      const { data: newKid } = await directus(token, "POST", "/items/kid", payload);
      if (kid.createdAt) {
        await directus(token, "PATCH", `/items/kid/${newKid.id}`, { date_created: kid.createdAt });
      }
      existingKids.byHygraphId.set(kid.id, newKid.id);
      created++;
    }

    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }

  console.log(`Kids migration complete: ${created} created, ${updated} updated, ${skipped} skipped`);
  console.log(`Families created: ${familiesCreated}`);
}

async function main() {
  if (!HYGRAPH_URL || !HYGRAPH_TOKEN) {
    console.error("Set HYGRAPH_URL and HYGRAPH_TOKEN in .env.local");
    process.exit(1);
  }

  console.log("Logging in to Directus...");
  const token = await directusLogin();

  console.log("Ensuring hygraph_id fields...");
  await ensureHygraphIdField(token, "family");
  await ensureHygraphIdField(token, "kid");
  await ensureHygraphIdField(token, "donor");

  const wishIdMap = await buildWishIdMap(token);
  const donorIdMap = await buildDonorIdMap(token);
  await migrateKids(token, wishIdMap, donorIdMap);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
