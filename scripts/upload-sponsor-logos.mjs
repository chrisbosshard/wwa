/**
 * Uploads sponsor logos from public/ to Directus and links them to sponsor entries.
 * Creates missing sponsors; updates existing ones matched by link.
 *
 * Usage: npm run directus:sponsor-logos
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

/** @type {Array<{ name: string; link: string; logo: string; featured?: boolean; pin_in_footer?: boolean; sort?: number }>} */
const SPONSORS = [
  { name: "Winterhilfe Zürich", link: "https://zh.winterhilfe.ch", logo: "logo_winterhilfe.png", featured: true, sort: 1 },
  { name: "Lions Club", link: "https://zuerich-rietberg.lionsclub.ch/", logo: "logo_lions.png", featured: true, sort: 2 },
  { name: "Canon", link: "https://ch.medical.canon/", logo: "canon.png", featured: true, sort: 3 },
  { name: "EF", link: "https://www.efswiss.ch/", logo: "ef.png", featured: true, sort: 4 },
  { name: "Micro", link: "https://www.micro-scooter.com/", logo: "micro.png", featured: true, sort: 5 },
  { name: "Veloblitz", link: "https://www.veloblitz.ch/", logo: "veloblitz.png", featured: true, sort: 6 },
  { name: "Dear Foundation", link: "https://dearfoundation.ch/", logo: "dear.png", featured: true, sort: 7 },
  { name: "Russell Reynolds", link: "https://www.russellreynolds.com/en/", logo: "russell_reynolds_weiss.png", featured: false },
  { name: "Barclays", link: "https://privatebank.barclays.com/", logo: "barclays.png", featured: false },
  { name: "Generali", link: "https://www.generali.ch/", logo: "generali.png", featured: false },
  { name: "zeb", link: "https://zeb-consulting.com/de-DE", logo: "zeb-Logo_weiss.png", featured: true },
  { name: "Google", link: "https://www.google.ch/", logo: "google.png", featured: true },
  { name: "LGT", link: "https://www.lgt.com/", logo: "lgt-bank_weiss.png", featured: true },
  { name: "Energie 360", link: "https://www.energie360.ch/", logo: "energie360.png", featured: true },
  { name: "Skope", link: "https://skope.swiss/", logo: "skope.png", featured: true },
  { name: "Wienachtsdorf", link: "https://www.wienachtsdorf.ch/", logo: "weihnachtsdorf.png", featured: true },
  { name: "SHL Medical", link: "https://www.shl-medical.com/", logo: "shl.png", featured: true },
  { name: "iWay", link: "https://www.iway.ch/", logo: "iway.png", featured: true },
  { name: "SIX", link: "https://www.six-group.com", logo: "six.png", featured: true },
  { name: "Belimo", link: "https://www.belimo.com/", logo: "belimo.png", featured: true },
  { name: "EQT", link: "https://eqtgroup.com/", logo: "eqt.png", featured: true },
  { name: "Allianz Trade", link: "https://www.allianz-trade.com/de_CH.html", logo: "logo-euler-hermes-allianz-weiss.png", featured: true },
  { name: "Pfizer", link: "https://www.pfizer.ch/de", logo: "Pfizer-logo_weiss.png", featured: true },
  { name: "Indosuez", link: "https://switzerland.ca-indosuez.com", logo: "indosuez.png", featured: true },
  { name: "UBS", link: "https://www.ubs.com/ch/en.html", logo: "ubs_weiss.png", featured: true },
  { name: "Winterhilfe Schaffhausen", link: "https://www.sh.winterhilfe.ch/", logo: "Logo_Winterhilfe_Schaffhausen.png", featured: true },
  { name: "Siech Cycles", link: "https://siech-cycles.com", logo: "sic.png", featured: true },
];

function normalizeLink(link) {
  return link.trim().replace(/\/+$/, "").toLowerCase();
}

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

async function api(token, method, path, body) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function uploadLogo(token, logoFile) {
  const filePath = path.join(PUBLIC_DIR, logoFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Logo file not found: ${filePath}`);
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(logoFile).toLowerCase();
  const mime =
    ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream";

  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mime }), logoFile);

  const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!uploadRes.ok) throw new Error(`Upload failed for ${logoFile}: ${await uploadRes.text()}`);
  return (await uploadRes.json()).data.id;
}

async function main() {
  console.log(`Uploading sponsor logos to ${DIRECTUS_URL}...`);
  const token = await login();

  const existingRes = await api(token, "GET", "/items/sponsor?limit=100&fields=id,name,link,logo");
  const existing = existingRes.data ?? [];
  const byLink = new Map(existing.map((item) => [normalizeLink(item.link || ""), item]));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const sponsor of SPONSORS) {
    const logoPath = path.join(PUBLIC_DIR, sponsor.logo);
    if (!fs.existsSync(logoPath)) {
      console.warn(`  ! skip ${sponsor.name}: missing ${sponsor.logo}`);
      skipped++;
      continue;
    }

    const key = normalizeLink(sponsor.link);
    let record = byLink.get(key);

    try {
      const logoId = await uploadLogo(token, sponsor.logo);
      const payload = {
        name: sponsor.name,
        link: sponsor.link,
        logo: logoId,
        featured: sponsor.featured ?? false,
        pin_in_footer: sponsor.pin_in_footer ?? false,
        sort: sponsor.sort ?? 0,
      };

      if (record) {
        await api(token, "PATCH", `/items/sponsor/${record.id}`, payload);
        console.log(`  ~ ${sponsor.name} (logo uploaded)`);
        updated++;
      } else {
        const createdRes = await api(token, "POST", "/items/sponsor", payload);
        byLink.set(key, createdRes.data);
        console.log(`  + ${sponsor.name}`);
        created++;
      }
    } catch (error) {
      console.error(`  ! ${sponsor.name}: ${error.message}`);
      skipped++;
    }
  }

  console.log(`\nDone. Created: ${created}, updated: ${updated}, skipped: ${skipped}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
