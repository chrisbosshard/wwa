import "dotenv/config";
import { pathToFileURL } from "url";
import { CAMPAIGN_CONTENT_DEFAULTS, CAMPAIGN_CONTENT_STATES } from "./campaign-content-data.mjs";

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
  return (await res.json()).data.access_token;
}

export async function seedCampaignContent(token, apiFn) {
  const api = apiFn || defaultApi.bind(null, token);

  for (const state of CAMPAIGN_CONTENT_STATES) {
    const row = CAMPAIGN_CONTENT_DEFAULTS[state];
    const existing = await api("GET", `/items/campaign_content?filter[state][_eq]=${row.state}&limit=1`);

    if (existing?.data?.length) {
      await api("PATCH", `/items/campaign_content/${existing.data[0].id}`, row);
    } else {
      await api("POST", "/items/campaign_content", row);
    }
  }
}

async function defaultApi(token, method, path, body) {
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

async function main() {
  console.log(`Seeding campaign content on ${DIRECTUS_URL}...`);
  const token = await login();
  await seedCampaignContent(token);
  console.log("Campaign content ready in Directus → campaign_content");
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
