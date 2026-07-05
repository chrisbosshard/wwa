/**
 * Repairs broken M2O / file relations in Directus (missing FK + relation metadata).
 *
 * Usage: npm run directus:fix-relations
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

const TIMESTAMP_COLLECTIONS = ["kid", "family", "donor"];

const RELATIONS = [
  { collection: "wish", field: "category", related: "category", oneField: "wishes" },
  { collection: "wish", field: "image", related: "directus_files" },
  { collection: "kid", field: "family", related: "family", oneField: "kids" },
  { collection: "kid", field: "wish", related: "wish", oneField: "kids" },
  { collection: "kid", field: "donor", related: "donor", oneField: "kids" },
  { collection: "family", field: "image", related: "directus_files" },
  { collection: "donor", field: "logo", related: "directus_files" },
  { collection: "sponsor", field: "logo", related: "directus_files" },
  { collection: "page_section", field: "page", related: "page", oneField: "sections" },
  { collection: "page_state_block", field: "page", related: "page", oneField: "state_blocks" },
];

async function getToken() {
  if (process.env.DIRECTUS_TOKEN) return process.env.DIRECTUS_TOKEN;

  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: ${await res.text()}`);
  return (await res.json()).data.access_token;
}

async function api(token, method, path, body) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    if (text.includes("already exists") || res.status === 409) return null;
    throw new Error(`${method} ${path}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function relationExists(token, collection, field) {
  try {
    const result = await api(token, "GET", `/relations/${collection}/${field}`);
    return Boolean(result?.data?.related_collection);
  } catch {
    return false;
  }
}

async function createRelation(token, { collection, field, related, oneField }) {
  if (await relationExists(token, collection, field)) {
    console.log(`  ✓ ${collection}.${field} (already configured)`);
    return;
  }

  await api(token, "POST", "/relations", {
    collection,
    field,
    related_collection: related,
    meta: oneField ? { one_field: oneField } : undefined,
    schema: { on_delete: "SET NULL" },
  });
  console.log(`  ✓ ${collection}.${field} → ${related}`);
}

async function ensureTimestamps(token, collection) {
  await api(token, "PATCH", `/collections/${collection}`, {
    meta: { accountability: "all" },
  });

  for (const [field, special] of [
    ["date_created", "date-created"],
    ["date_updated", "date-updated"],
  ]) {
    try {
      await api(token, "GET", `/fields/${collection}/${field}`);
    } catch {
      await api(token, "POST", `/fields/${collection}`, {
        field,
        type: "timestamp",
        meta: {
          special: [special],
          interface: "datetime",
          readonly: true,
          hidden: true,
          width: "half",
        },
      });
    }
  }

  console.log(`  ✓ ${collection} timestamps enabled`);
}

async function backfillKidDates(token) {
  const result = await api(token, "GET", "/items/kid?filter[date_created][_null]=true&fields=id&limit=-1");
  const kids = result?.data || [];
  if (!kids.length) return;

  const now = new Date().toISOString();
  for (const kid of kids) {
    await api(token, "PATCH", `/items/kid/${kid.id}`, { date_created: now });
  }
  console.log(`  ✓ backfilled date_created for ${kids.length} kid(s)`);
}

async function main() {
  console.log(`Fixing Directus schema on ${DIRECTUS_URL}...`);
  const token = await getToken();

  console.log("\nEnabling collection timestamps...");
  for (const collection of TIMESTAMP_COLLECTIONS) {
    await ensureTimestamps(token, collection);
  }
  await backfillKidDates(token);

  console.log("\nRepairing relations...");
  for (const relation of RELATIONS) {
    await createRelation(token, relation);
  }

  console.log("\nSchema fixes complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
