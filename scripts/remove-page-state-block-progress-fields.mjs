/**
 * Removes progress bar fields from page_state_block (now handled in code).
 *
 * Usage: npm run directus:remove-state-block-progress
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

const FIELDS = [
  "show_progress",
  "progress_title",
  "progress_max",
  "progress_value_source",
  "progress_fixed_value",
];

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

async function main() {
  console.log(`Removing page_state_block progress fields on ${DIRECTUS_URL}...`);
  const token = await login();

  for (const field of FIELDS) {
    const res = await fetch(`${DIRECTUS_URL}/fields/page_state_block/${field}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 404) {
      console.log(`  - ${field} (not found)`);
      continue;
    }

    if (!res.ok) {
      throw new Error(`DELETE page_state_block.${field}: ${await res.text()}`);
    }

    console.log(`  ✓ removed ${field}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
