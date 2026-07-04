/**
 * Creates a volunteer (Redakteur) login for the online Directus admin.
 *
 * Usage:
 *   npm run directus:create-editor -- --email max@caritas-zuerich.ch --first-name Max --last-name Muster
 *
 * Optional: --password (generated if omitted)
 */
import "dotenv/config";
import { randomBytes } from "crypto";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || "admin@caritas-zuerich.ch";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || "DirectusAdmin2026!";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--") && args[i + 1]) {
      out[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }
  return out;
}

async function getToken() {
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
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function main() {
  const { email, "first-name": firstName, "last-name": lastName, password: givenPassword } = parseArgs();

  if (!email || !firstName) {
    console.error("Usage: npm run directus:create-editor -- --email EMAIL --first-name Vorname [--last-name Nachname] [--password PASS]");
    process.exit(1);
  }

  const password = givenPassword || randomBytes(9).toString("base64url");
  const token = await getToken();

  const { data: roles } = await api(token, "GET", '/roles?filter[name][_eq]=Redakteur&fields=id');
  const roleId = roles?.[0]?.id;
  if (!roleId) {
    console.error("Redakteur role not found. Run: npm run directus:roles");
    process.exit(1);
  }

  const { data: user } = await api(token, "POST", "/users", {
    email,
    password,
    first_name: firstName,
    last_name: lastName || "",
    role: roleId,
    status: "active",
  });

  const adminUrl = `${DIRECTUS_URL.replace(/\/$/, "")}/admin`;

  console.log("\n✅ Redakteur-Konto erstellt\n");
  console.log(`   Admin-Oberfläche: ${adminUrl}`);
  console.log(`   E-Mail:           ${email}`);
  console.log(`   Passwort:         ${password}`);
  console.log(`   User-ID:          ${user.id}`);
  console.log("\nTeile diese Zugangsdaten sicher mit der Person (nicht per unverschlüsselter E-Mail).\n");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
