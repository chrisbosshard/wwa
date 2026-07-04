/**
 * Migrates data from Hygraph to Directus.
 * Requires HYGRAPH_URL, HYGRAPH_TOKEN, DIRECTUS_URL, DIRECTUS_ADMIN_* in .env
 *
 * Usage: npm run migrate:hygraph
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

async function importAsset(token, url, mimeType) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const extByMime = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    const contentType = mimeType || res.headers.get("content-type") || "application/octet-stream";
    const baseName = url.split("/").pop()?.split("?")[0] || "asset";
    const filename = baseName.includes(".") ? baseName : `${baseName}.${extByMime[contentType] || "jpg"}`;
    const form = new FormData();
    form.append("file", new Blob([buffer], { type: contentType }), filename);
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

const idMap = { category: {}, wish: {}, family: {}, donor: {}, kid: {} };

async function fixM2ORelations(token) {
  const relations = [
    { collection: "wish", field: "category", related: "category", oneField: "wishes" },
    { collection: "wish", field: "image", related: "directus_files" },
    { collection: "kid", field: "family", related: "family", oneField: "kids" },
    { collection: "kid", field: "wish", related: "wish", oneField: "kids" },
    { collection: "kid", field: "donor", related: "donor", oneField: "kids" },
    { collection: "family", field: "image", related: "directus_files" },
    { collection: "donor", field: "logo", related: "directus_files" },
  ];

  console.log("Ensuring Directus relations are configured...");
  for (const { collection, field, related, oneField } of relations) {
    let exists = false;
    try {
      const relation = await directus(token, "GET", `/relations/${collection}/${field}`);
      exists = Boolean(relation?.data?.related_collection);
    } catch {
      exists = false;
    }
    if (exists) continue;

    await directus(token, "POST", "/relations", {
      collection,
      field,
      related_collection: related,
      meta: oneField ? { one_field: oneField } : undefined,
      schema: { on_delete: "SET NULL" },
    });
    console.log(`  ✓ ${collection}.${field} → ${related}`);
  }
}

async function fixWishFields(token) {
  console.log("Ensuring wish.link supports long URLs...");
  try {
    await directus(token, "DELETE", "/fields/wish/link");
  } catch {
    // field may not exist
  }
  await directus(token, "POST", "/fields/wish", {
    field: "link",
    type: "text",
    meta: { interface: "input-multiline" },
  });
}

async function clearPartialMigration(token) {
  const { data: categories } = await directus(token, "GET", "/items/category?limit=-1&fields=id");
  let wishes = [];
  try {
    ({ data: wishes } = await directus(token, "GET", "/items/wish?limit=-1&fields=id"));
  } catch {
    wishes = [];
  }
  if (categories?.length) {
    console.log(`Clearing ${categories.length} categories from partial migration...`);
    await directus(token, "DELETE", "/items/category", categories.map((c) => c.id));
  }
  if (wishes?.length) {
    console.log(`Clearing ${wishes.length} wishes from partial migration...`);
    await directus(token, "DELETE", "/items/wish", wishes.map((w) => w.id));
  }
}

async function migrateCategories(token) {
  const { categories } = await hygraph(`query { categories { id name } }`);
  for (const cat of categories || []) {
    const { data } = await directus(token, "POST", "/items/category", { name: cat.name });
    idMap.category[cat.id] = data.id;
  }
  console.log(`Migrated ${Object.keys(idMap.category).length} categories`);
}

async function migrateWishes(token) {
  let skip = 0;
  let total = 0;
  while (true) {
    const { wishes } = await hygraph(
      `query($skip: Int!) { wishes(first: 100, skip: $skip) {
        id description ageRange active code link article voucher year individual toCheck
        image { url mimeType } category { id }
      }}`,
      { skip }
    );
    if (!wishes?.length) break;
    for (const w of wishes) {
      const imageId = await importAsset(token, w.image?.url, w.image?.mimeType);
      const { data } = await directus(token, "POST", "/items/wish", {
        description: w.description,
        age_range: w.ageRange,
        active: w.active,
        code: w.code,
        link: w.link,
        article: w.article,
        voucher: w.voucher === true || w.voucher === "true",
        year: w.year,
        individual: w.individual,
        to_check: w.toCheck,
        image: imageId,
        category: w.category ? idMap.category[w.category.id] : null,
      });
      idMap.wish[w.id] = data.id;
      total++;
    }
    skip += 100;
  }
  console.log(`Migrated ${total} wishes`);
}

async function migrateDonors(token) {
  let skip = 0;
  let total = 0;
  while (true) {
    const { donors } = await hygraph(
      `query($skip: Int!) { donors(first: 100, skip: $skip) {
        id titel prename surname address zipcode city email public numberOfGifts paymentSuccessful logo { url }
      }}`,
      { skip }
    );
    if (!donors?.length) break;
    for (const d of donors) {
      const logoId = await importAsset(token, d.logo?.url);
      const { data } = await directus(token, "POST", "/items/donor", {
        titel: d.titel,
        prename: d.prename,
        surname: d.surname,
        address: d.address,
        zipcode: d.zipcode,
        city: d.city,
        email: d.email,
        public: d.public,
        number_of_gifts: d.numberOfGifts,
        payment_successful: d.paymentSuccessful,
        logo: logoId,
      });
      idMap.donor[d.id] = data.id;
      total++;
    }
    skip += 100;
  }
  console.log(`Migrated ${total} donors`);
}

async function migrateFamiliesAndKids(token) {
  let after = null;
  let kidTotal = 0;
  let familyTotal = 0;

  while (true) {
    const data = await hygraph(
      `query($after: String) {
        kidsConnection(first: 100, after: $after, orderBy: id_DESC) {
          edges { cursor node {
            id prename age active checkout completed code createdAt
            family { id prename surname street nr zipcode city email phone comment leginr origin contactPermission image { url } }
            wish { id } donor { id }
          }}
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { after }
    );

    const conn = data.kidsConnection;
    const familiesSeen = new Set();

    for (const { node: kid } of conn.edges) {
      if (kid.family && !familiesSeen.has(kid.family.id) && !idMap.family[kid.family.id]) {
        const f = kid.family;
        const imageId = await importAsset(token, f.image?.url);
        const { data: family } = await directus(token, "POST", "/items/family", {
          prename: f.prename,
          surname: f.surname,
          street: f.street,
          nr: f.nr,
          zipcode: f.zipcode,
          city: f.city,
          email: f.email,
          phone: f.phone,
          comment: f.comment,
          leginr: f.leginr,
          origin: f.origin,
          contact_permission: f.contactPermission,
          image: imageId,
        });
        idMap.family[f.id] = family.id;
        familiesSeen.add(f.id);
        familyTotal++;
      }

      const { data: newKid } = await directus(token, "POST", "/items/kid", {
        prename: kid.prename,
        age: kid.age,
        active: kid.active,
        checkout: kid.checkout,
        completed: kid.completed,
        code: kid.code,
        family: kid.family ? idMap.family[kid.family.id] : null,
        wish: kid.wish ? idMap.wish[kid.wish.id] : null,
        donor: kid.donor ? idMap.donor[kid.donor.id] : null,
      });
      if (kid.createdAt) {
        await directus(token, "PATCH", `/items/kid/${newKid.id}`, { date_created: kid.createdAt });
      }
      idMap.kid[kid.id] = newKid.id;
      kidTotal++;
    }

    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }

  console.log(`Migrated ${familyTotal} families, ${kidTotal} kids`);
}

async function main() {
  if (!HYGRAPH_URL || !HYGRAPH_TOKEN) {
    console.error("Set HYGRAPH_URL and HYGRAPH_TOKEN in .env");
    process.exit(1);
  }

  console.log("Logging in to Directus...");
  const token = await directusLogin();

  await fixM2ORelations(token);
  await fixWishFields(token);
  await clearPartialMigration(token);

  await migrateCategories(token);
  await migrateWishes(token);
  await migrateDonors(token);
  await migrateFamiliesAndKids(token);

  console.log("Migration complete.");
  console.log("Counts:", {
    categories: Object.keys(idMap.category).length,
    wishes: Object.keys(idMap.wish).length,
    donors: Object.keys(idMap.donor).length,
    families: Object.keys(idMap.family).length,
    kids: Object.keys(idMap.kid).length,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
