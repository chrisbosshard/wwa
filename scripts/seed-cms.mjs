/**
 * Seeds CMS pages and sponsors from hardcoded wwa-2026 content.
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

async function upsertPage(token, page) {
  const existing = await fetch(`${DIRECTUS_URL}/items/page?filter[slug][_eq]=${page.slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

  if (existing.data?.length) {
    await fetch(`${DIRECTUS_URL}/items/page/${existing.data[0].id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
  } else {
    await fetch(`${DIRECTUS_URL}/items/page`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
  }
}

const pages = [
  {
    title: "Über die Aktion",
    slug: "info",
    sort_order: 1,
    body: `<p>Kinder haben Wünsche – kleinere und grössere. Oft gehen diese zu Weihnachten in Erfüllung. Nicht so bei Kindern aus Familien, die nur über ein schmales Budget verfügen. Die Weihnachtswunschaktion von Caritas Zürich leistet hier seit über 10 Jahren einen Beitrag, indem sie ebensolche Wünsche erfüllt.</p>
<p>Unterstützt durch verschiedene Firmen, Stiftungen und Privatpersonen erfüllen wir mit dem gespendeten Geld Weihnachtswünsche, welche uns Kinder im Oktober eingereicht haben – zum Beispiel einen Eintritt in den Zoo oder ins Alpamare, einen kuscheligen Teddy Bär, eine Gigampfi oder Kinotickets.</p>
<p>Partner verwandeln die Weihnachtswünsche in der Adventszeit mit Mitarbeitenden oder Freiwilligen zu schönen Geschenke, welche dann kurz vor Weihnachten den Familien übergeben werden.</p>`,
  },
  {
    title: "Kinder unterstützen",
    slug: "help",
    sort_order: 2,
    body: `<p>Informationen zur Unterstützung armutsbetroffener Kinder im Kanton Zürich.</p>`,
  },
  {
    title: "Kontakt",
    slug: "contact",
    sort_order: 3,
    body: `<p>Caritas Zürich<br>Beckenhofstrasse 16<br>8006 Zürich<br>weihnachtswunsch@caritas-zuerich.ch</p>`,
  },
  {
    title: "Impressum",
    slug: "impressum",
    sort_order: 4,
    body: `<p>Caritas Zürich – Weihnachtswunschaktion</p>`,
  },
];

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
  console.log("Seeding pages...");
  for (const page of pages) {
    await upsertPage(token, page);
    console.log(`  ${page.slug}`);
  }

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
      registration_limit: 3000,
      email: "weihnachtswunsch@caritas-zuerich.ch",
      address: "Caritas Zürich, Beckenhofstrasse 16, 8006 Zürich",
      contact: "044 366 68 68",
    }),
  }).catch(() => null);

  console.log("CMS seed complete.");
}

main().catch(console.error);
