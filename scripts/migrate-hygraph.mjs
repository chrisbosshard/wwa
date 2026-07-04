/**
 * Migrates data from Hygraph to Directus.
 * Requires HYGRAPH_URL, HYGRAPH_TOKEN, DIRECTUS_URL, DIRECTUS_ADMIN_* in .env
 *
 * Usage: npm run migrate:hygraph
 */
import "dotenv/config";

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

async function importAsset(token, url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const form = new FormData();
    const filename = url.split("/").pop()?.split("?")[0] || "asset.jpg";
    form.append("file", new Blob([buffer]), filename);
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
        image { url } category { id }
      }}`,
      { skip }
    );
    if (!wishes?.length) break;
    for (const w of wishes) {
      const imageId = await importAsset(token, w.image?.url);
      const { data } = await directus(token, "POST", "/items/wish", {
        description: w.description,
        age_range: w.ageRange,
        active: w.active,
        code: w.code,
        link: w.link,
        article: w.article,
        voucher: w.voucher,
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
