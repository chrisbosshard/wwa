/**
 * Fixes sponsor logo preview in Directus admin and ensures partner_tier is visible.
 *
 * Usage: npm run directus:fix-sponsor
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

async function main() {
  console.log(`Fixing sponsor admin UI on ${DIRECTUS_URL}...`);
  const token = await login();

  if (!(await relationExists(token, "sponsor", "logo"))) {
    await api(token, "POST", "/relations", {
      collection: "sponsor",
      field: "logo",
      related_collection: "directus_files",
      schema: { on_delete: "SET NULL" },
    });
    console.log("  + sponsor.logo → directus_files relation");
  } else {
    console.log("  ✓ sponsor.logo relation ok");
  }

  await api(token, "PATCH", "/fields/sponsor/logo", {
    meta: {
      interface: "file-image",
      special: ["file"],
      display: "image",
      note: "Partnerlogo (PNG mit transparentem Hintergrund empfohlen)",
    },
  });
  console.log("  ✓ sponsor.logo field interface updated");

  const { data: presets } = await api(token, "GET", "/presets?filter[collection][_eq]=sponsor&limit=-1");
  for (const preset of presets ?? []) {
    await api(token, "PATCH", `/presets/${preset.id}`, {
      layout: [
        "name",
        "link",
        "partner_tier",
        "logo",
        "featured",
        "pin_in_footer",
        "sort",
      ],
    });
    console.log(`  ✓ reset sponsor preset ${preset.id}`);
  }

  if (!presets?.length) {
    await api(token, "POST", "/presets", {
      collection: "sponsor",
      layout: ["name", "link", "partner_tier", "logo", "featured", "pin_in_footer", "sort"],
    });
    console.log("  + created default sponsor preset");
  }

  console.log("\nDone. Reload the sponsor item in Directus (hard refresh).");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
