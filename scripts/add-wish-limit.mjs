/**
 * Adds wish_limit to global_setting and copies registration_limit if needed.
 *
 * Usage: npm run directus:wish-limit
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
  console.log(`Adding wish_limit on ${DIRECTUS_URL}...`);
  const token = await login();

  if (!(await fieldExists(token, "wish_limit"))) {
    await api(token, "/fields/global_setting", "POST", {
      field: "wish_limit",
      type: "integer",
      meta: {
        interface: "input",
        note: "Maximale Anzahl Wünsche für alle Fortschrittsanzeigen",
      },
      schema: { default_value: 3000 },
    });
    console.log("  + global_setting.wish_limit");
  } else {
    console.log("  ✓ global_setting.wish_limit already exists");
  }

  const settings = await api(token, "/items/global_setting?fields=wish_limit,registration_limit");
  const current = settings?.data ?? {};
  if (!current.wish_limit && current.registration_limit) {
    await api(token, "/items/global_setting", "PATCH", {
      wish_limit: current.registration_limit,
    });
    console.log(`  ✓ copied registration_limit (${current.registration_limit}) → wish_limit`);
  } else if (current.wish_limit) {
    console.log(`  ✓ wish_limit already set (${current.wish_limit})`);
  } else {
    await api(token, "/items/global_setting", "PATCH", { wish_limit: 3000 });
    console.log("  ✓ set default wish_limit = 3000");
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
