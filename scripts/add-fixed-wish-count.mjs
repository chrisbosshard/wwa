/**
 * Adds fixed_wish_count to global_setting for manual progress bar override.
 *
 * Usage: npm run directus:fixed-wish-count
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

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

async function api(token, path, method = "GET", body) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    if (text.includes("already exists") || res.status === 409) return null;
    throw new Error(`${method} ${path}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

async function fieldExists(token, field) {
  const res = await fetch(`${DIRECTUS_URL}/fields/global_setting/${field}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

async function main() {
  console.log(`Adding fixed_wish_count on ${DIRECTUS_URL}...`);
  const token = await login();

  if (!(await fieldExists(token, "fixed_wish_count"))) {
    await api(token, "/fields/global_setting", "POST", {
      field: "fixed_wish_count",
      type: "integer",
      meta: {
        interface: "input",
        note: "Optional: Feste Anzahl erfüllter Wünsche für die Fortschrittsanzeige (überschreibt Live-Zählung)",
        translations: [{ language: "de-DE", translation: "Fixed Wish Count" }],
      },
      schema: {},
    });
    console.log("  + global_setting.fixed_wish_count");
  } else {
    console.log("  ✓ global_setting.fixed_wish_count already exists");
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
