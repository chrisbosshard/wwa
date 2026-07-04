/**
 * Creates the "Redakteur" role with permissions for non-developer volunteers.
 * Uses DIRECTUS_TOKEN (admin static token) or admin login.
 *
 * Usage: npm run directus:roles
 */
import "dotenv/config";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

const EDITOR_COLLECTIONS = ["page", "sponsor", "global_setting", "wish", "category", "application"];
const ACTIONS = ["create", "read", "update", "delete"];

async function getToken() {
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

async function getOrCreateRole(token) {
  const result = await api(token, "GET", "/roles?fields=id,name&limit=100");
  const existing = result?.data?.find((r) => r.name === "Redakteur");
  if (existing) return existing.id;

  const created = await api(token, "POST", "/roles", {
    name: "Redakteur",
    icon: "edit",
    description: "Freiwillige: Texte, Wünsche, Partner und Kampagnenstatus bearbeiten",
    app_access: true,
    admin_access: false,
  });
  return created.data.id;
}

async function setPermission(token, roleId, collection, action) {
  await api(token, "POST", "/permissions", {
    role: roleId,
    collection,
    action,
    fields: ["*"],
    permissions: {},
    validation: {},
  }).catch(() => null);
}

async function main() {
  console.log(`Setting up Redakteur role on ${DIRECTUS_URL}...`);
  const token = await getToken();
  const roleId = await getOrCreateRole(token);

  for (const collection of EDITOR_COLLECTIONS) {
    for (const action of ACTIONS) {
      await setPermission(token, roleId, collection, action);
    }
    console.log(`  ✓ ${collection}`);
  }

  console.log("\nRedakteur role ready.");
  console.log("Create volunteer login: npm run directus:create-editor -- --email NAME@example.com --first-name Vorname");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
