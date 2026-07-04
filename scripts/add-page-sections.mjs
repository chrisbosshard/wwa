/**
 * Adds structured subsite fields (page.lead/footnote/icon, page_section, page_state_block).
 * Idempotent — safe on existing Render Directus.
 *
 * Usage: npm run directus:page-sections
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PAGE_LAYOUTS, PAGE_STATE_CHOICES } from "./directus-field-choices.mjs";

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

async function fieldExists(token, collection, field) {
  const res = await fetch(`${DIRECTUS_URL}/fields/${collection}/${field}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

async function collectionExists(token, name) {
  const res = await fetch(`${DIRECTUS_URL}/collections/${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

async function createField(token, collection, field, type, meta = {}) {
  if (await fieldExists(token, collection, field)) return;
  await api(token, `/fields/${collection}`, "POST", {
    field,
    type,
    meta,
    schema: meta.schema || {},
  });
  console.log(`  + ${collection}.${field}`);
}

async function createM2OField(token, collection, field, relatedCollection, oneField) {
  if (!(await fieldExists(token, collection, field))) {
    await api(token, `/fields/${collection}`, "POST", {
      field,
      type: "integer",
      meta: { interface: "select-dropdown-m2o", special: ["m2o"] },
    });
    console.log(`  + ${collection}.${field}`);
  }

  try {
    const relation = await api(token, `/relations/${collection}/${field}`);
    if (relation?.data?.related_collection) return;
  } catch {
    // missing
  }

  await api(token, "/relations", "POST", {
    collection,
    field,
    related_collection: relatedCollection,
    meta: oneField ? { one_field: oneField } : undefined,
    schema: { on_delete: "CASCADE" },
  });
  console.log(`  ✓ ${collection}.${field} → ${relatedCollection}`);
}

async function main() {
  console.log(`Adding page sections schema on ${DIRECTUS_URL}...`);
  const token = await login();

  console.log("\nExtending page collection...");
  await createField(token, "page", "lead", "text", {
    interface: "input-rich-text-html",
    note: "Einleitungstext unter der Seitenüberschrift",
  });
  await createField(token, "page", "footnote", "text", {
    interface: "input-rich-text-html",
    note: "Fusstnote / Disclaimer am Seitenende",
  });
  await createField(token, "page", "icon", "string", {
    interface: "input",
    note: "Icon-Dateiname (z. B. icon1.png) für die Ecke im Hero",
  });
  await createField(token, "page", "layout", "string", {
    interface: "select-dropdown",
    options: { choices: PAGE_LAYOUTS },
    schema: { default_value: "simple" },
    note: "Seitenlayout: einfach, 1/2/3 Spalten",
  });

  if (!(await collectionExists(token, "page_section"))) {
    console.log("\nCreating page_section...");
    await api(token, "/collections", "POST", {
      collection: "page_section",
      meta: {
        icon: "view_module",
        note: "Inhaltsblöcke für strukturierte Unterseiten (2-Spalten-Grid)",
        translations: [
          {
            language: "de-DE",
            translation: "Seiten-Abschnitte",
            singular: "Seiten-Abschnitt",
            plural: "Seiten-Abschnitte",
          },
        ],
      },
      schema: { name: "page_section" },
    });
  }

  await createField(token, "page_section", "title", "string", { interface: "input", required: true });
  await createField(token, "page_section", "body", "text", { interface: "input-rich-text-html" });
  await createField(token, "page_section", "column", "integer", {
    interface: "select-dropdown",
    options: {
      choices: [
        { text: "Linke Spalte", value: 1 },
        { text: "Rechte Spalte", value: 2 },
        { text: "Dritte Spalte", value: 3 },
      ],
    },
    schema: { default_value: 1 },
  });
  await createField(token, "page_section", "sort", "integer", { interface: "input", schema: { default_value: 0 } });
  await createM2OField(token, "page_section", "page", "page", "sections");

  if (!(await collectionExists(token, "page_state_block"))) {
    console.log("\nCreating page_state_block...");
    await api(token, "/collections", "POST", {
      collection: "page_state_block",
      meta: {
        icon: "dynamic_feed",
        note: "Phasenabhängige Texte pro Unterseite (z. B. Anmelden je nach Kampagnenstatus)",
        translations: [
          {
            language: "de-DE",
            translation: "Seiten-Phasentexte",
            singular: "Seiten-Phasentext",
            plural: "Seiten-Phasentexte",
          },
        ],
      },
      schema: { name: "page_state_block" },
    });
  }

  await createField(token, "page_state_block", "state", "string", {
    interface: "select-dropdown",
    required: true,
    options: { choices: PAGE_STATE_CHOICES },
  });
  await createField(token, "page_state_block", "headline", "string", {
    interface: "input",
    note: "Grosser zentrierter Status-Text",
  });
  await createField(token, "page_state_block", "lead", "text", {
    interface: "input-rich-text-html",
    note: "Einleitungstext (erster Absatz, gleiche Darstellung wie Page Lead)",
  });
  await createField(token, "page_state_block", "body", "text", {
    interface: "input-rich-text-html",
    note: "Längerer Text unter der Überschrift",
  });
  await createField(token, "page_state_block", "button_label", "string", { interface: "input" });
  await createField(token, "page_state_block", "button_url", "string", {
    interface: "input",
    note: "Intern (/auswaehlen) oder externe URL",
  });
  await createM2OField(token, "page_state_block", "page", "page", "state_blocks");

  if (!(await collectionExists(token, "page_button"))) {
    console.log("\nCreating page_button...");
    await api(token, "/collections", "POST", {
      collection: "page_button",
      meta: {
        icon: "smart_button",
        note: "Call-to-Action Buttons für Unterseiten",
        translations: [
          {
            language: "de-DE",
            translation: "Seiten-Buttons",
            singular: "Seiten-Button",
            plural: "Seiten-Buttons",
          },
        ],
      },
      schema: { name: "page_button" },
    });
  }

  await createField(token, "page_button", "label", "string", { interface: "input", required: true });
  await createField(token, "page_button", "url", "string", {
    interface: "input",
    required: true,
    note: "Intern (/anmelden) oder externe URL",
  });
  await createField(token, "page_button", "external", "boolean", {
    interface: "boolean",
    schema: { default_value: false },
  });
  await createField(token, "page_button", "style", "string", {
    interface: "select-dropdown",
    options: {
      choices: [
        { text: "Primär", value: "primary" },
        { text: "Outline", value: "outline" },
      ],
    },
    schema: { default_value: "primary" },
  });
  await createField(token, "page_button", "sort", "integer", { interface: "input", schema: { default_value: 0 } });
  await createM2OField(token, "page_button", "page", "page", "buttons");

  console.log("\nDone. Run: npm run directus:roles (to grant access to new collections)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
