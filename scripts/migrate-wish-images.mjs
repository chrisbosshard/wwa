/**
 * Backfills wish images from Hygraph into Directus.
 * Matches wishes by description and uploads missing images.
 *
 * Usage: npm run migrate:wish-images
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

const HYGRAPH_URL = process.env.HYGRAPH_URL;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;
const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

async function hygraph(query, variables = {}) {
  const res = await fetch(HYGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function directusLogin() {
  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const { data } = await res.json();
  return data.access_token;
}

async function directus(token, method, path, body) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function importAsset(token, url, mimeType) {
  if (!url) return null;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = await res.arrayBuffer();
  const extByMime = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const contentType = mimeType || res.headers.get("content-type") || "application/octet-stream";
  const baseName = url.split("/").pop()?.split("?")[0] || "asset";
  const filename = baseName.includes(".") ? baseName : `${baseName}.${extByMime[contentType] || "jpg"}`;
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: contentType }), filename);
  const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
  const { data } = await uploadRes.json();
  return data.id;
}

async function ensurePublicFileAccess(token) {
  const policies = await directus(token, "GET", "/policies?fields=id,icon,name&limit=100");
  const publicPolicy =
    policies.data.find((p) => p.icon === "public") ||
    policies.data.find((p) => /public/i.test(p.name || ""));
  if (!publicPolicy) return;

  const existing = await directus(
    token,
    "GET",
    `/permissions?filter[policy][_eq]=${publicPolicy.id}&filter[collection][_eq]=directus_files&filter[action][_eq]=read&limit=1`
  );
  if (existing.data?.length) return;

  await directus(token, "POST", "/permissions", {
    policy: publicPolicy.id,
    collection: "directus_files",
    action: "read",
    fields: ["*"],
    permissions: {},
    validation: {},
  });
}

async function main() {
  if (!HYGRAPH_URL || !HYGRAPH_TOKEN) {
    console.error("Set HYGRAPH_URL and HYGRAPH_TOKEN in .env.local");
    process.exit(1);
  }

  const token = await directusLogin();
  await ensurePublicFileAccess(token);

  const { data: directusWishes } = await directus(
    token,
    "GET",
    "/items/wish?limit=-1&fields=id,description,image"
  );
  const byDescription = new Map(directusWishes.map((w) => [w.description?.trim(), w]));

  let skip = 0;
  let uploaded = 0;
  let skipped = 0;
  let fixed = 0;

  while (true) {
    const { wishes } = await hygraph(
      `query($skip: Int!) {
        wishes(first: 100, skip: $skip) {
          description
          image { url mimeType }
        }
      }`,
      { skip }
    );
    if (!wishes?.length) break;

    for (const wish of wishes) {
      if (!wish.image?.url) continue;
      const directusWish = byDescription.get(wish.description?.trim());
      if (!directusWish) {
        console.warn(`No Directus match for: ${wish.description}`);
        continue;
      }
      if (directusWish.image) {
        skipped++;
        const file = await directus(token, "GET", `/files/${directusWish.image}`);
        if (file.data.type === "application/octet-stream" && wish.image.mimeType) {
          await directus(token, "PATCH", `/files/${directusWish.image}`, {
            type: wish.image.mimeType,
          });
          fixed++;
        }
        continue;
      }

      const imageId = await importAsset(token, wish.image.url, wish.image.mimeType);
      await directus(token, "PATCH", `/items/wish/${directusWish.id}`, { image: imageId });
      uploaded++;
      console.log(`  ✓ ${wish.description}`);
    }

    skip += 100;
  }

  console.log("\nWish image migration complete.");
  console.log({ uploaded, skipped, fixedMime: fixed });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
