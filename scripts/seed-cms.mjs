/**
 * Optional bootstrap for sponsors and global settings only.
 * Page content is managed exclusively in Directus.
 *
 * Usage: npm run seed:cms
 */
import "dotenv/config";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

async function login() {
  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const { data } = await res.json();
  return data.access_token;
}

const sponsors = [
  { name: "Winterhilfe", link: "https://zh.winterhilfe.ch", featured: true },
  { name: "Lions Club", link: "https://zuerich-rietberg.lionsclub.ch/", featured: true },
  { name: "Canon", link: "https://ch.medical.canon/", featured: true },
  { name: "EF", link: "https://www.efswiss.ch/", featured: true },
  { name: "Micro", link: "https://www.micro-scooter.com/", featured: true },
  { name: "Veloblitz", link: "https://www.veloblitz.ch/", featured: true },
  { name: "Dear Foundation", link: "https://dearfoundation.ch/", featured: true },
  { name: "Russell Reynolds", link: "https://www.russellreynolds.com/en/", featured: false },
  { name: "Barclays", link: "https://privatebank.barclays.com/", featured: false },
  { name: "Generali", link: "https://www.generali.ch/", featured: false },
];

async function main() {
  const token = await login();

  console.log("Seeding sponsors...");
  for (const sponsor of sponsors) {
    await fetch(`${DIRECTUS_URL}/items/sponsor`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(sponsor),
    }).catch(() => null);
  }

  await fetch(`${DIRECTUS_URL}/items/global_setting`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      wish_limit: 3000,
      registration_limit: 3000,
      email: "weihnachtswunsch@caritas-zuerich.ch",
      address: "Caritas Zürich, Beckenhofstrasse 16, 8006 Zürich",
      contact: "044 366 68 68",
    }),
  }).catch(() => null);

  console.log("CMS bootstrap complete (pages are not seeded — edit content in Directus).");
}

main().catch(console.error);
