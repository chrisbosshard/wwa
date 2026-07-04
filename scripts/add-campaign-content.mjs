/**
 * Adds campaign_content collection + seed data (idempotent).
 * Use when Directus already exists but campaign_content is missing.
 *
 * Usage: npm run directus:campaign-content
 */
import "dotenv/config";
import { seedCampaignContent } from "./seed-campaign-content.mjs";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

const APPLICATION_STATES = [
  "pre_registration",
  "registration",
  "waitinglist",
  "post_registration",
  "wish_fulfilment",
  "closed",
  "done",
];

const CAMPAIGN_STATE_CHOICES = APPLICATION_STATES.map((s) => ({ text: s, value: s }));
const PROGRESS_VALUE_SOURCES = [
  { text: "Erfüllte Wünsche (live)", value: "completed_kids" },
  { text: "Angemeldete Wünsche (live)", value: "registered_kids" },
  { text: "Fester Wert", value: "fixed" },
];
const BUTTON_STYLES = [
  { text: "Primär (rot)", value: "primary" },
  { text: "Outline", value: "outline" },
];

async function login() {
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
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    if (text.includes("already exists") || res.status === 409) return null;
    throw new Error(`${method} ${path}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

async function createField(token, collection, field, type, meta = {}) {
  return api(token, `/fields/${collection}`, "POST", {
    field,
    type,
    meta,
    schema: meta.schema || {},
  });
}

async function collectionExists(token, name) {
  const res = await fetch(`${DIRECTUS_URL}/collections/${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return false;
  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data?.data);
}

async function main() {
  console.log(`Adding campaign_content on ${DIRECTUS_URL}...`);
  const token = await login();

  if (!(await collectionExists(token, "campaign_content"))) {
    console.log("Creating collection campaign_content...");
    await api(token, "/collections", "POST", {
      collection: "campaign_content",
      meta: {
        icon: "home",
        note: "Startseiten-Texte pro Kampagnenphase — welcher Text live ist, steuert Application → State",
        translations: [
          {
            language: "de-DE",
            translation: "Startseiten-Texte",
            singular: "Startseiten-Text",
            plural: "Startseiten-Texte",
          },
        ],
      },
      schema: { name: "campaign_content" },
    });
  } else {
    console.log("Collection campaign_content already exists, updating label...");
    await api(token, "/collections/campaign_content", "PATCH", {
      meta: {
        icon: "home",
        note: "Startseiten-Texte pro Kampagnenphase — welcher Text live ist, steuert Application → State",
        translations: [
          {
            language: "de-DE",
            translation: "Startseiten-Texte",
            singular: "Startseiten-Text",
            plural: "Startseiten-Texte",
          },
        ],
      },
    });
  }

  const fields = [
    [
      "state",
      "string",
      {
        interface: "select-dropdown",
        required: true,
        options: { choices: CAMPAIGN_STATE_CHOICES },
        schema: { is_unique: true },
      },
    ],
    ["show_page_title", "boolean", { interface: "boolean", schema: { default_value: true } }],
    ["page_title", "string", { interface: "input" }],
    ["lead", "text", { interface: "input-rich-text-html" }],
    ["body", "text", { interface: "input-rich-text-html" }],
    ["show_progress", "boolean", { interface: "boolean", schema: { default_value: false } }],
    ["progress_title", "string", { interface: "input" }],
    ["progress_max", "integer", { interface: "input" }],
    [
      "progress_value_source",
      "string",
      { interface: "select-dropdown", options: { choices: PROGRESS_VALUE_SOURCES } },
    ],
    ["progress_fixed_value", "integer", { interface: "input" }],
  ];

  for (const [field, type, meta] of fields) {
    await createField(token, "campaign_content", field, type, meta);
  }

  for (const n of [1, 2, 3]) {
    await createField(token, "campaign_content", `button_${n}_label`, "string", { interface: "input" });
    await createField(token, "campaign_content", `button_${n}_url`, "string", { interface: "input" });
    await createField(token, "campaign_content", `button_${n}_external`, "boolean", {
      interface: "boolean",
      schema: { default_value: false },
    });
    await createField(token, "campaign_content", `button_${n}_style`, "string", {
      interface: "select-dropdown",
      options: { choices: BUTTON_STYLES },
      schema: { default_value: "primary" },
    });
  }

  await seedCampaignContent(token, (method, path, body) => api(token, path, method, body));

  console.log("\nDone. In Directus: Inhalt → Startseiten-Texte (campaign_content), 7 Einträge.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
