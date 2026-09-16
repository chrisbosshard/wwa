/**
 * Creates Directus collections matching the former Hygraph schema.
 * Run after `docker compose up -d`: npm run directus:setup
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

async function login() {
  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: ${await res.text()}`);
  const { data } = await res.json();
  return data.access_token;
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

async function createCollection(token, name, meta = {}) {
  return api(token, "/collections", "POST", {
    collection: name,
    meta: {
      icon: meta.icon || "box",
      singleton: meta.singleton || false,
      accountability: meta.accountability,
      ...meta,
    },
    schema: { name },
  });
}

async function ensureTimestamps(token, collection) {
  await api(token, `/collections/${collection}`, "PATCH", {
    meta: { accountability: "all" },
  });

  for (const [field, special] of [
    ["date_created", "date-created"],
    ["date_updated", "date-updated"],
  ]) {
    try {
      await api(token, `/fields/${collection}/${field}`);
    } catch {
      await api(token, `/fields/${collection}`, "POST", {
        field,
        type: "timestamp",
        meta: {
          special: [special],
          interface: "datetime",
          readonly: true,
          hidden: true,
          width: "half",
        },
      });
    }
  }
}

async function createField(token, collection, field, type, meta = {}) {
  return api(token, `/fields/${collection}`, "POST", {
    field,
    type,
    meta,
    schema: meta.schema || {},
  });
}

async function createM2OField(token, collection, field, relatedCollection, oneField) {
  try {
    await api(token, `/fields/${collection}/${field}`);
  } catch {
    await api(token, `/fields/${collection}`, "POST", {
      field,
      type: "integer",
      meta: {
        interface: "select-dropdown-m2o",
        special: ["m2o"],
      },
    });
  }

  try {
    const relation = await api(token, `/relations/${collection}/${field}`);
    if (relation?.data?.related_collection) return;
  } catch {
    // relation missing
  }

  await api(token, "/relations", "POST", {
    collection,
    field,
    related_collection: relatedCollection,
    meta: oneField ? { one_field: oneField } : undefined,
    schema: { on_delete: "SET NULL" },
  });
}

async function ensureO2MField(token, collection, field, template) {
  const meta = {
    interface: "list-o2m",
    special: ["o2m"],
    options: { template },
    display: "related-values",
    display_options: { template },
  };

  try {
    await api(token, `/fields/${collection}/${field}`, "PATCH", { meta });
  } catch {
    await api(token, `/fields/${collection}`, "POST", {
      field,
      type: "alias",
      meta,
    });
  }
}

async function createFileRelation(token, collection, field) {
  try {
    const relation = await api(token, `/relations/${collection}/${field}`);
    if (relation?.data?.related_collection) return;
  } catch {
    // relation missing
  }

  await api(token, "/relations", "POST", {
    collection,
    field,
    related_collection: "directus_files",
    schema: { on_delete: "SET NULL" },
  });
}

async function createFileField(token, collection, field) {
  return api(token, `/fields/${collection}`, "POST", {
    field,
    type: "uuid",
    meta: {
      interface: "file-image",
      special: ["file"],
    },
  });
}

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

async function main() {
  console.log("Logging in to Directus...");
  const token = await login();

  const collections = [
    { name: "application", singleton: true, icon: "flag" },
    { name: "campaign_content", icon: "home" },
    { name: "global_setting", singleton: true, icon: "settings" },
    { name: "category", icon: "category" },
    { name: "wish", icon: "card_giftcard" },
    { name: "family", icon: "family_restroom" },
    { name: "kid", icon: "child_care" },
    { name: "donor", icon: "volunteer_activism" },
    { name: "page", icon: "article" },
    { name: "page_section", icon: "view_module" },
    { name: "page_state_block", icon: "dynamic_feed" },
    { name: "sponsor", icon: "handshake" },
  ];

  for (const col of collections) {
    console.log(`Creating collection: ${col.name}`);
    await createCollection(token, col.name, { singleton: col.singleton, icon: col.icon });
  }

  for (const name of ["kid", "family", "donor"]) {
    console.log(`Enabling timestamps: ${name}`);
    await ensureTimestamps(token, name);
  }

  // application
  await createField(token, "application", "state", "string", {
    interface: "select-dropdown",
    options: { choices: APPLICATION_STATES.map((s) => ({ text: s, value: s })) },
    schema: { default_value: "pre_registration" },
  });

  // campaign_content — homepage texts per app state
  await createField(token, "campaign_content", "state", "string", {
    interface: "select-dropdown",
    required: true,
    options: { choices: CAMPAIGN_STATE_CHOICES },
    schema: { is_unique: true },
  });
  await createField(token, "campaign_content", "show_page_title", "boolean", {
    interface: "boolean",
    schema: { default_value: true },
  });
  await createField(token, "campaign_content", "page_title", "string", {
    interface: "input",
    note: "Überschrift im weissen Bereich (z. B. Weihnachtswunschaktion)",
  });
  await createField(token, "campaign_content", "lead", "text", {
    interface: "input-rich-text-html",
    note: "Haupttext oberhalb des Fortschrittsbalkens",
  });
  await createField(token, "campaign_content", "body", "text", {
    interface: "input-rich-text-html",
    note: "Zweiter Textblock unter dem Fortschrittsbalken",
  });
  await createField(token, "campaign_content", "show_progress", "boolean", {
    interface: "boolean",
    schema: { default_value: false },
  });
  await createField(token, "campaign_content", "progress_title", "string", { interface: "input" });
  await createField(token, "campaign_content", "progress_value_source", "string", {
    interface: "select-dropdown",
    options: { choices: PROGRESS_VALUE_SOURCES },
  });
  await createField(token, "campaign_content", "progress_fixed_value", "integer", {
    interface: "input",
    note: "Nur bei «Fester Wert»",
  });
  for (const n of [1, 2, 3]) {
    await createField(token, "campaign_content", `button_${n}_label`, "string", {
      interface: "input",
      note: `Button ${n} — Label (leer lassen zum Ausblenden)`,
    });
    await createField(token, "campaign_content", `button_${n}_url`, "string", {
      interface: "input",
      note: "Intern (/anmelden) oder externe URL",
    });
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

  // global_setting
  for (const f of [
    ["site_logo", "uuid", "file-image"],
    ["hero_logo", "uuid", "file-image"],
    ["site_logo_white", "uuid", "file-image"],
    ["address", "text", "input-multiline"],
    ["email", "string", "input"],
    ["contact", "text", "input-multiline"],
    [
      "wish_limit",
      "integer",
      "input",
      {
        note: "Maximale Anzahl Wünsche für alle Fortschrittsanzeigen",
        schema: { default_value: 3000 },
      },
    ],
    [
      "fixed_wish_count",
      "integer",
      "input",
      {
        note: "Optional: Feste Anzahl erfüllter Wünsche für die Fortschrittsanzeige (überschreibt Live-Zählung)",
        translations: [{ language: "de-DE", translation: "Fixed Wish Count" }],
      },
    ],
    ["registration_limit", "integer", "input", { schema: { default_value: 3000 } }],
  ]) {
    await createField(token, "global_setting", f[0], f[1], { interface: f[2], ...(f[3] || {}) });
  }

  // category
  await createField(token, "category", "name", "string", { interface: "input", required: true });

  // wish
  for (const f of [
    ["description", "text", "input-multiline", { required: true }],
    ["age_range", "integer", "input"],
    ["active", "boolean", "boolean", { schema: { default_value: true } }],
    ["code", "string", "input"],
    ["link", "text", "input-multiline"],
    ["article", "string", "input"],
    ["voucher", "boolean", "boolean"],
    ["year", "string", "input"],
    ["individual", "boolean", "boolean"],
    ["to_check", "boolean", "boolean"],
  ]) {
    await createField(token, "wish", f[0], f[1], { interface: f[2], ...(f[3] || {}) });
  }
  await createFileField(token, "wish", "image");
  await createFileRelation(token, "wish", "image");
  await createM2OField(token, "wish", "category", "category", "wishes");

  // family
  for (const f of [
    ["prename", "string"], ["surname", "string"], ["street", "string"], ["nr", "string"],
    ["zipcode", "string"], ["city", "string"], ["email", "string"], ["phone", "string"],
    ["comment", "text"], ["leginr", "string"], ["origin", "string"],
    ["contact_permission", "boolean"],
  ]) {
    await createField(token, "family", f[0], f[1] === "text" ? "text" : f[1] === "boolean" ? "boolean" : "string", {
      interface: f[1] === "text" ? "input-multiline" : f[1] === "boolean" ? "boolean" : "input",
    });
  }
  await createFileField(token, "family", "image");
  await createFileRelation(token, "family", "image");

  // kid
  for (const f of [
    ["prename", "string"], ["age", "integer"], ["active", "boolean", { schema: { default_value: true } }],
    ["checkout", "timestamp"], ["completed", "boolean"], ["code", "string"],
  ]) {
    await createField(token, "kid", f[0], f[1], {
      interface: f[1] === "boolean" ? "boolean" : f[1] === "timestamp" ? "datetime" : "input",
      ...(f[2] || {}),
    });
  }
  await createM2OField(token, "kid", "family", "family", "kids");
  await ensureO2MField(token, "family", "kids", "{{prename}} · {{age}} Jahre");
  await createM2OField(token, "kid", "wish", "wish", "kids");
  await ensureO2MField(token, "wish", "kids", "{{prename}} · {{age}} Jahre");
  await createM2OField(token, "kid", "donor", "donor", "kids");
  await ensureO2MField(token, "donor", "kids", "{{prename}} · {{age}} Jahre");

  // donor
  for (const f of [
    ["titel", "string"], ["prename", "string"], ["surname", "string"], ["address", "string"],
    ["zipcode", "string"], ["city", "string"], ["email", "string"], ["public", "string"],
    ["number_of_gifts", "integer"], ["payment_successful", "string", { schema: { default_value: "No" } }],
    ["manual_upload", "boolean"],
  ]) {
    await createField(token, "donor", f[0], f[1], {
      interface: f[1] === "boolean" ? "boolean" : f[1] === "integer" ? "input" : "input",
      ...(f[2] || {}),
    });
  }
  await createFileField(token, "donor", "logo");
  await createFileRelation(token, "donor", "logo");

  // page
  for (const f of [
    ["title", "string", { required: true }], ["slug", "string", { required: true, unique: true }],
    ["body", "text"], ["lead", "text"], ["footnote", "text"], ["icon", "string"], ["sort_order", "integer"],
  ]) {
    await createField(token, "page", f[0], f[1] === "text" ? "text" : f[1] === "integer" ? "integer" : "string", {
      interface:
        f[0] === "lead" || f[0] === "footnote" || f[0] === "body"
          ? "input-rich-text-html"
          : f[1] === "integer"
            ? "input"
            : "input",
      ...(f[2] || {}),
    });
  }
  await createFileField(token, "page", "hero_image");

  // page_section
  await createField(token, "page_section", "title", "string", { interface: "input", required: true });
  await createField(token, "page_section", "body", "text", { interface: "input-rich-text-html" });
  await createField(token, "page_section", "column", "integer", {
    interface: "select-dropdown",
    options: {
      choices: [
        { text: "Linke Spalte", value: 1 },
        { text: "Rechte Spalte", value: 2 },
      ],
    },
    schema: { default_value: 1 },
  });
  await createField(token, "page_section", "sort", "integer", { interface: "input", schema: { default_value: 0 } });
  await createM2OField(token, "page_section", "page", "page", "sections");

  // page_state_block
  const PAGE_STATE_CHOICES = ["pre_registration", "registration", "waitinglist", "wish_fulfilment"].map((s) => ({
    text: s,
    value: s,
  }));
  await createField(token, "page_state_block", "state", "string", {
    interface: "select-dropdown",
    required: true,
    options: { choices: PAGE_STATE_CHOICES },
  });
  await createField(token, "page_state_block", "notification", "string", {
    interface: "input",
    note: "Hinweis-Box unter dem Inhalt (grauer Rahmen mit Icon)",
  });
  await createField(token, "page_state_block", "body", "text", { interface: "input-rich-text-html" });
  await createField(token, "page_state_block", "button_label", "string", { interface: "input" });
  await createField(token, "page_state_block", "button_url", "string", { interface: "input" });
  await createM2OField(token, "page_state_block", "page", "page", "state_blocks");

  // sponsor
  for (const f of [
    ["name", "string"], ["link", "string"], ["featured", "boolean"],
    ["pin_in_footer", "boolean"], ["sort", "integer"], ["partner_tier", "string"],
  ]) {
    await createField(token, "sponsor", f[0], f[1] === "boolean" ? "boolean" : f[1] === "integer" ? "integer" : "string", {
      interface: f[1] === "boolean" ? "boolean" : f[1] === "integer" ? "input" : f[0] === "partner_tier" ? "select-dropdown" : "input",
      ...(f[0] === "pin_in_footer" ? { note: "Im Footer immer anzeigen (Unterstützt von)" } : {}),
      ...(f[0] === "featured" ? { note: "Kann im Footer rotierend angezeigt werden" } : {}),
      ...(f[0] === "sort" ? { note: "Reihenfolge (niedrigere Zahl = weiter links)", schema: { default_value: 0 } } : {}),
      ...(f[0] === "partner_tier"
        ? {
            note: "Partnerseite: Hauptpartner oben, andere Partner unten",
            options: {
              choices: [
                { text: "Hauptpartner (oben)", value: "top" },
                { text: "Partner (unten)", value: "standard" },
              ],
            },
            schema: { default_value: "standard" },
          }
        : {}),
    });
  }
  await createFileField(token, "sponsor", "logo");
  await createFileRelation(token, "sponsor", "logo");

  // Seed application singleton
  await api(token, "/items/application", "POST", { state: "registration" }).catch(() =>
    api(token, "/items/application", "PATCH", { state: "registration" })
  );

  await api(token, "/items/global_setting", "POST", {
    wish_limit: 3000,
    registration_limit: 3000,
    email: "weihnachtswunsch@caritas-zuerich.ch",
    address: "Caritas Zürich, Beckenhofstrasse 16, 8006 Zürich",
  }).catch(() => null);

  console.log("Setting display templates...");
  const { setDirectusDisplayTemplates } = await import("./set-directus-display-templates.mjs");
  await setDirectusDisplayTemplates(token);

  console.log("Schema setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
