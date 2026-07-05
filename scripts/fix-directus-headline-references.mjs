/**
 * Find and fix all Directus references to page_state_block.headline
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
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path}: ${text}`);
  return text ? JSON.parse(text) : null;
}

function containsHeadline(obj) {
  return JSON.stringify(obj).includes("headline");
}

function replaceHeadline(value) {
  if (value === "headline") return "notification";
  if (Array.isArray(value)) return value.map(replaceHeadline);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceHeadline(v)]));
  }
  return value;
}

async function main() {
  const token = await login();
  console.log(`Scanning ${DIRECTUS_URL} for headline references...\n`);

  // 1. All presets (full)
  const { data: presets } = await api(token, "/presets?limit=-1");
  console.log(`Presets: ${presets.length}`);
  for (const p of presets) {
    if (containsHeadline(p)) {
      console.log(`  FOUND preset id=${p.id} collection=${p.collection} user=${p.user} role=${p.role}`);
      console.log(`    layout: ${JSON.stringify(p.layout)}`);
      console.log(`    layout_query: ${JSON.stringify(p.layout_query)}`);
    }
  }

  // 2. All permissions
  const { data: perms } = await api(token, "/permissions?limit=-1&fields=id,collection,action,fields,policy");
  for (const p of perms) {
    if (p.collection === "page_state_block" || containsHeadline(p.fields)) {
      console.log(`  permission id=${p.id} ${p.collection} ${p.action} fields=${JSON.stringify(p.fields)}`);
    }
  }

  // 3. All fields meta for page and page_state_block
  for (const col of ["page", "page_state_block"]) {
    const { data: fields } = await api(token, `/fields/${col}`);
    for (const f of fields) {
      if (containsHeadline(f.meta) || containsHeadline(f.schema)) {
        console.log(`  FOUND field meta ${col}.${f.field}: ${JSON.stringify(f.meta?.options || f.meta?.display_options || f.meta)}`);
      }
    }
  }

  // 4. Collection meta
  for (const col of ["page", "page_state_block"]) {
    const { data: c } = await api(token, `/collections/${col}`);
    if (containsHeadline(c.meta)) {
      console.log(`  FOUND collection meta ${col}: ${JSON.stringify(c.meta)}`);
    }
  }

  // 5. Settings
  try {
    const settings = await api(token, "/settings");
    if (containsHeadline(settings)) {
      console.log(`  FOUND in settings: ${JSON.stringify(settings.data)}`);
    }
  } catch {
    console.log("  (settings endpoint not available)");
  }

  // 6. Test query that Directus UI would make
  try {
    await api(token, "/items/page_state_block?limit=1&fields=id,state,title,notification,lead,body,headline,page");
    console.log("  Query with headline field: OK (field exists?)");
  } catch (e) {
    console.log(`  Query with headline field: ${e.message.slice(0, 120)}`);
  }

  // 7. Test without headline
  try {
    const r = await api(token, "/items/page_state_block?limit=1&fields=id,state,title,notification,lead,body,page");
    console.log(`  Query without headline: OK (${r.data?.length} items)`);
  } catch (e) {
    console.log(`  Query without headline: ${e.message.slice(0, 120)}`);
  }

  // 8. Check if headline field still exists
  const headlineRes = await fetch(`${DIRECTUS_URL}/fields/page_state_block/headline`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`\nheadline field exists: ${headlineRes.ok}`);

  const notifRes = await fetch(`${DIRECTUS_URL}/fields/page_state_block/notification`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`notification field exists: ${notifRes.ok}`);

  // FIX: delete ALL presets that mention headline, reset all page/page_state_block presets
  console.log("\n--- Applying fixes ---");
  for (const p of presets) {
    if (containsHeadline(p) || p.collection === "page_state_block" || p.collection === "page") {
      await api(token, `/presets/${p.id}`, "PATCH", {
        layout: null,
        layout_query: null,
        layout_options: null,
        search: null,
        filters: null,
      });
      console.log(`  reset preset ${p.id} (${p.collection})`);
    }
  }

  // FIX permissions
  for (const p of perms) {
    if (Array.isArray(p.fields) && p.fields.includes("headline")) {
      const fields = p.fields.map((f) => (f === "headline" ? "notification" : f));
      await api(token, `/permissions/${p.id}`, "PATCH", { fields });
      console.log(`  fixed permission ${p.id}`);
    }
    if (Array.isArray(p.fields) && p.fields.length > 0 && !p.fields.includes("*") && p.collection === "page_state_block") {
      if (!p.fields.includes("notification")) {
        const fields = [...p.fields.filter((f) => f !== "headline"), "notification"];
        await api(token, `/permissions/${p.id}`, "PATCH", { fields });
        console.log(`  added notification to permission ${p.id}`);
      }
    }
  }

  // FIX field meta
  for (const col of ["page", "page_state_block"]) {
    const { data: fields } = await api(token, `/fields/${col}`);
    for (const f of fields) {
      if (containsHeadline(f.meta)) {
        await api(token, `/fields/${col}/${f.field}`, "PATCH", { meta: replaceHeadline(f.meta) });
        console.log(`  fixed ${col}.${f.field} meta`);
      }
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
