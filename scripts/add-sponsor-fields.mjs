/**
 * Adds pin_in_footer and sort fields to sponsor collection.
 *
 * Usage: npm run directus:sponsor-fields
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
  const res = await fetch(`${DIRECTUS_URL}/fields/sponsor/${field}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

async function main() {
  console.log(`Adding sponsor fields on ${DIRECTUS_URL}...`);
  const token = await login();

  if (!(await fieldExists(token, "pin_in_footer"))) {
    await api(token, "/fields/sponsor", "POST", {
      field: "pin_in_footer",
      type: "boolean",
      meta: {
        interface: "boolean",
        note: "Im Footer immer anzeigen (Unterstützt von)",
      },
    });
    console.log("  + sponsor.pin_in_footer");
  }

  if (!(await fieldExists(token, "sort"))) {
    await api(token, "/fields/sponsor", "POST", {
      field: "sort",
      type: "integer",
      meta: {
        interface: "input",
        note: "Reihenfolge (niedrigere Zahl = weiter links)",
      },
      schema: { default_value: 0 },
    });
    console.log("  + sponsor.sort");
  }

  if (!(await fieldExists(token, "featured"))) {
    await api(token, "/fields/sponsor", "POST", {
      field: "featured",
      type: "boolean",
      meta: {
        interface: "boolean",
        note: "Kann im Footer rotierend angezeigt werden",
      },
    });
    console.log("  + sponsor.featured");
  }

  if (!(await fieldExists(token, "partner_tier"))) {
    await api(token, "/fields/sponsor", "POST", {
      field: "partner_tier",
      type: "string",
      meta: {
        interface: "select-dropdown",
        display: "labels",
        options: {
          choices: [
            { text: "Hauptpartner (oben)", value: "top" },
            { text: "Partner (unten)", value: "standard" },
          ],
        },
        note: "Partnerseite: Hauptpartner erscheinen oben, andere Partner darunter",
      },
      schema: { default_value: "standard" },
    });
    console.log("  + sponsor.partner_tier");
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
