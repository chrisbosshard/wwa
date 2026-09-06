/**
 * Sets Directus collection display templates so relations show names instead of IDs.
 *
 * Usage: npm run directus:display-templates
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

/** Collection → Handlebars-style display template (shown in lists, dropdowns, relations). */
export const DISPLAY_TEMPLATES = {
  family: "{{prename}} {{surname}} ({{email}})",
  kid: "{{prename}} · {{age}} Jahre",
  wish: "{{description}}",
  donor: "{{prename}} {{surname}}",
  category: "{{name}}",
  page: "{{title}}",
  page_section: "{{title}}",
  page_state_block: "{{state}} — {{page.title}}",
  page_button: "{{label}}",
  sponsor: "{{name}}",
  campaign_content: "{{state}}",
};

async function login() {
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
  if (!res.ok) throw new Error(`${method} ${path}: ${text}`);
  return text ? JSON.parse(text) : null;
}

export async function setDirectusDisplayTemplates(token) {
  for (const [collection, display_template] of Object.entries(DISPLAY_TEMPLATES)) {
    try {
      await api(token, "PATCH", `/collections/${collection}`, {
        meta: { display_template },
      });
      console.log(`  ${collection}: ${display_template}`);
    } catch (error) {
      console.warn(`  ${collection}: skipped (${error.message})`);
    }
  }
}

async function main() {
  console.log(`Setting display templates on ${DIRECTUS_URL}...\n`);
  const token = await login();
  await setDirectusDisplayTemplates(token);
  console.log("\nDone. Relation fields now show readable labels instead of IDs.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
