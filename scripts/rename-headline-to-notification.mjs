/**
 * Renames page_state_block.headline → notification and copies existing values.
 *
 * Usage: npm run directus:rename-notification
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
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} failed: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function fieldExists(token, collection, field) {
  const res = await fetch(`${DIRECTUS_URL}/fields/${collection}/${field}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

function replaceHeadline(value) {
  if (value === "headline") return "notification";
  if (Array.isArray(value)) return value.map(replaceHeadline);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, replaceHeadline(nested)]));
  }
  return value;
}

function containsHeadline(value) {
  return JSON.stringify(value).includes('"headline"') || JSON.stringify(value).includes("headline");
}

async function fixStaleReferences(token) {
  const { data: presets } = await api(token, "/presets?limit=-1");
  for (const preset of presets) {
    if (!containsHeadline(preset)) continue;

    const patch = {};
    for (const key of ["layout", "layout_query", "layout_options", "search", "filters"]) {
      if (preset[key] != null && containsHeadline(preset[key])) {
        patch[key] = replaceHeadline(preset[key]);
      }
    }

    if (Object.keys(patch).length) {
      await api(token, `/presets/${preset.id}`, "PATCH", patch);
      console.log(`  updated preset ${preset.id} (${preset.collection || "global"})`);
    }
  }

  const { data: permissions } = await api(token, "/permissions?filter[collection][_eq]=page_state_block&limit=-1");
  for (const permission of permissions) {
    if (!Array.isArray(permission.fields) || !permission.fields.includes("headline")) continue;
    const fields = permission.fields.map((field) => (field === "headline" ? "notification" : field));
    await api(token, `/permissions/${permission.id}`, "PATCH", { fields });
    console.log(`  updated permission ${permission.id}`);
  }
}

async function main() {
  console.log(`Renaming page_state_block.headline → notification on ${DIRECTUS_URL}...`);
  const token = await login();

  const hasHeadline = await fieldExists(token, "page_state_block", "headline");
  const hasNotification = await fieldExists(token, "page_state_block", "notification");

  if (!hasHeadline && hasNotification) {
    console.log("Field already migrated. Fixing stale UI references...");
    await fixStaleReferences(token);
    return;
  }

  if (!hasNotification) {
    await api(token, "/fields/page_state_block", "POST", {
      field: "notification",
      type: "string",
      meta: {
        interface: "input",
        note: "Hinweis-Box unter dem Inhalt (grauer Rahmen mit Icon)",
      },
      schema: {},
    });
    console.log("  + page_state_block.notification");
  }

  if (hasHeadline) {
    const { data: blocks } = await api(token, "/items/page_state_block?limit=-1&fields=id,headline,notification");
    for (const block of blocks) {
      if (block.headline && !block.notification) {
        await api(token, `/items/page_state_block/${block.id}`, "PATCH", {
          notification: block.headline,
        });
        console.log(`  copied headline → notification for block ${block.id}`);
      }
    }

    const res = await fetch(`${DIRECTUS_URL}/fields/page_state_block/headline`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      console.log("  - page_state_block.headline");
    } else {
      console.warn(`  could not delete headline: ${await res.text()}`);
    }
  }

  await fixStaleReferences(token);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
