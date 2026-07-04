/**
 * Creates the "Redakteur" role with permissions for non-developer volunteers.
 * Directus 11+: permissions are attached to policies, not roles directly.
 *
 * Usage: npm run directus:roles
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

const EDITOR_COLLECTIONS = ["page", "page_section", "page_state_block", "page_button", "sponsor", "global_setting", "wish", "category", "application", "campaign_content"];
const PUBLIC_READ_COLLECTIONS = [
  "application",
  "campaign_content",
  "global_setting",
  "page",
  "page_section",
  "page_state_block",
  "page_button",
  "sponsor",
  "wish",
  "category",
  "kid",
  "family",
  "donor",
  "directus_files",
];
const EDITOR_ACTIONS = ["create", "read", "update", "delete"];

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

async function getPublicPolicyId(token) {
  const result = await api(token, "GET", "/policies?fields=id,name,icon&limit=100");
  const policy =
    result?.data?.find((p) => p.icon === "public") ||
    result?.data?.find((p) => /public/i.test(p.name || ""));
  if (!policy) throw new Error("Public policy not found");
  return policy.id;
}

async function getOrCreateEditorPolicy(token, roleId) {
  const result = await api(token, "GET", "/policies?fields=id,name&limit=100");
  let policy = result?.data?.find((p) => p.name === "Redakteur");
  if (!policy) {
    const created = await api(token, "POST", "/policies", {
      name: "Redakteur",
      icon: "edit",
      description: "Freiwillige: Texte, Wünsche, Partner und Kampagnenstatus bearbeiten",
      app_access: true,
      admin_access: false,
    });
    policy = created.data;
  }

  const access = await api(token, "GET", `/access?filter[role][_eq]=${roleId}&fields=id,policy`);
  const linked = access?.data?.some((entry) => entry.policy === policy.id);
  if (!linked) {
    await api(token, "POST", "/access", { role: roleId, policy: policy.id });
  }

  return policy.id;
}

async function getOrCreateRole(token) {
  const result = await api(token, "GET", "/roles?fields=id,name&limit=100");
  const existing = result?.data?.find((r) => r.name === "Redakteur");
  if (existing) return existing.id;

  const created = await api(token, "POST", "/roles", {
    name: "Redakteur",
    icon: "edit",
    description: "Freiwillige: Texte, Wünsche, Partner und Kampagnenstatus bearbeiten",
  });
  return created.data.id;
}

async function setPolicyPermission(token, policyId, collection, action) {
  const existing = await api(
    token,
    "GET",
    `/permissions?filter[policy][_eq]=${policyId}&filter[collection][_eq]=${collection}&filter[action][_eq]=${action}&fields=id,fields&limit=1`
  );
  const payload = {
    policy: policyId,
    collection,
    action,
    fields: ["*"],
    permissions: {},
    validation: {},
  };

  if (existing?.data?.length) {
    const permission = existing.data[0];
    const hasAllFields = Array.isArray(permission.fields) && permission.fields.includes("*");
    if (hasAllFields) return;
    await api(token, "PATCH", `/permissions/${permission.id}`, payload);
    return;
  }

  await api(token, "POST", "/permissions", payload);
}

async function main() {
  console.log(`Setting up roles and policies on ${DIRECTUS_URL}...`);
  const token = await getToken();
  const roleId = await getOrCreateRole(token);
  const editorPolicyId = await getOrCreateEditorPolicy(token, roleId);
  const publicPolicyId = await getPublicPolicyId(token);

  for (const collection of EDITOR_COLLECTIONS) {
    for (const action of EDITOR_ACTIONS) {
      await setPolicyPermission(token, editorPolicyId, collection, action);
    }
    console.log(`  ✓ Redakteur ${collection}`);
  }

  console.log("\nSetting up Public read access...");
  for (const collection of PUBLIC_READ_COLLECTIONS) {
    await setPolicyPermission(token, publicPolicyId, collection, "read");
    console.log(`  ✓ public read ${collection}`);
  }

  console.log("\nRedakteur role ready.");
  console.log("Create volunteer login: npm run directus:create-editor -- --email NAME@example.com --first-name Vorname");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
