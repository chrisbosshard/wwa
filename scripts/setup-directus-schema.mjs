/**
 * Creates Directus collections matching the former Hygraph schema.
 * Run after `docker compose up -d`: npm run directus:setup
 */
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
    meta: { icon: meta.icon || "box", singleton: meta.singleton || false, ...meta },
    schema: { name },
  });
}

async function createField(token, collection, field, type, meta = {}) {
  return api(token, `/fields/${collection}`, "POST", {
    field,
    type,
    meta,
    schema: meta.schema || {},
  });
}

async function createM2OField(token, collection, field, relatedCollection) {
  return api(token, `/fields/${collection}`, "POST", {
    field,
    type: "uuid",
    meta: {
      interface: "select-dropdown-m2o",
      special: ["m2o"],
    },
    schema: {
      foreign_key_table: relatedCollection,
      foreign_key_column: "id",
    },
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
];

async function main() {
  console.log("Logging in to Directus...");
  const token = await login();

  const collections = [
    { name: "application", singleton: true, icon: "flag" },
    { name: "global_setting", singleton: true, icon: "settings" },
    { name: "category", icon: "category" },
    { name: "wish", icon: "card_giftcard" },
    { name: "family", icon: "family_restroom" },
    { name: "kid", icon: "child_care" },
    { name: "donor", icon: "volunteer_activism" },
    { name: "page", icon: "article" },
    { name: "sponsor", icon: "handshake" },
  ];

  for (const col of collections) {
    console.log(`Creating collection: ${col.name}`);
    await createCollection(token, col.name, { singleton: col.singleton, icon: col.icon });
  }

  // application
  await createField(token, "application", "state", "string", {
    interface: "select-dropdown",
    options: { choices: APPLICATION_STATES.map((s) => ({ text: s, value: s })) },
    schema: { default_value: "pre_registration" },
  });

  // global_setting
  for (const f of [
    ["site_logo", "uuid", "file-image"],
    ["hero_logo", "uuid", "file-image"],
    ["site_logo_white", "uuid", "file-image"],
    ["address", "text", "input-multiline"],
    ["email", "string", "input"],
    ["contact", "text", "input-multiline"],
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
    ["link", "string", "input"],
    ["article", "string", "input"],
    ["voucher", "boolean", "boolean"],
    ["year", "string", "input"],
    ["individual", "boolean", "boolean"],
    ["to_check", "boolean", "boolean"],
  ]) {
    await createField(token, "wish", f[0], f[1], { interface: f[2], ...(f[3] || {}) });
  }
  await createFileField(token, "wish", "image");
  await createM2OField(token, "wish", "category", "category");

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
  await createM2OField(token, "kid", "family", "family");
  await createM2OField(token, "kid", "wish", "wish");
  await createM2OField(token, "kid", "donor", "donor");

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

  // page
  for (const f of [
    ["title", "string", { required: true }], ["slug", "string", { required: true, unique: true }],
    ["body", "text"], ["sort_order", "integer"],
  ]) {
    await createField(token, "page", f[0], f[1] === "text" ? "text" : f[1] === "integer" ? "integer" : "string", {
      interface: f[1] === "text" ? "input-rich-text-html" : "input",
      ...(f[2] || {}),
    });
  }
  await createFileField(token, "page", "hero_image");

  // sponsor
  for (const f of [
    ["name", "string"], ["link", "string"], ["featured", "boolean"],
  ]) {
    await createField(token, "sponsor", f[0], f[1] === "boolean" ? "boolean" : "string", {
      interface: f[1] === "boolean" ? "boolean" : "input",
    });
  }
  await createFileField(token, "sponsor", "logo");

  // Seed application singleton
  await api(token, "/items/application", "POST", { state: "registration" }).catch(() =>
    api(token, "/items/application", "PATCH", { state: "registration" })
  );

  await api(token, "/items/global_setting", "POST", {
    registration_limit: 3000,
    email: "weihnachtswunsch@caritas-zuerich.ch",
    address: "Caritas Zürich, Beckenhofstrasse 16, 8006 Zürich",
  }).catch(() => null);

  console.log("Schema setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
