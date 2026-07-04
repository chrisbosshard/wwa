# CMS online stellen & an Freiwillige weitergeben

Ziel: Eine **öffentliche URL** (z. B. `https://cms.weihnachtswunsch.ch/admin`), die ein Nicht-Entwickler im Browser nutzen kann — **ohne Code, ohne GitHub**.

**Website auf Vercel?** Ja — die Next.js-Seite gehört auf **Vercel**. Directus (CMS) läuft separat auf Render/Railway, weil Vercel keinen dauerhaften Server für Directus bietet. Beide verbinden Sie über Umgebungsvariablen in Vercel — siehe [DEPLOYMENT.md](../DEPLOYMENT.md).

## Option A — Render für Directus (empfohlen, einfach)

1. Repository auf GitHub pushen (nur `wwa-2026`)
2. Auf [render.com](https://render.com) → **New → Blueprint**
3. Repo verbinden — Render erkennt [`render.yaml`](../render.yaml)
4. Nach dem Deploy:
   - **PUBLIC_URL** in Render setzen auf `https://IHR-SERVICE.onrender.com`
   - Admin-Passwort aus Render-Umgebungsvariablen notieren (`ADMIN_PASSWORD`)
5. Von Ihrem Rechner (einmalig):

```bash
cd wwa-2026
export DIRECTUS_URL=https://IHR-SERVICE.onrender.com
export DIRECTUS_ADMIN_PASSWORD=<aus Render Dashboard>

npm run directus:setup
npm run directus:roles
npm run directus:campaign-content
npm run seed:cms
npm run directus:create-editor -- --email redakteur@caritas-zuerich.ch --first-name Vorname
```

6. **An Freiwilligen weitergeben:**
   - Link: `https://IHR-SERVICE.onrender.com/admin`
   - E-Mail + Passwort (sicher, z. B. Telefon / Signal)
   - Anleitung: [ANLEITUNG-REDAKTEUR.md](./ANLEITUNG-REDAKTEUR.md)

7. **Website auf Vercel verbinden** — in Vercel → Settings → Environment Variables:

   | Variable | Wert |
   |----------|------|
   | `DIRECTUS_URL` | `https://IHR-SERVICE.onrender.com` |
   | `NEXT_PUBLIC_DIRECTUS_URL` | gleich |
   | `DIRECTUS_TOKEN` | `ADMIN_TOKEN` aus Render |

   In Directus/Render: `CORS_ORIGIN` = Ihre Vercel-URL + Produktionsdomain.

   Vollständige Anleitung: [DEPLOYMENT.md](../DEPLOYMENT.md)

**Kosten:** ca. CHF 15–25/Monat (Starter DB + Web Service).

---

## Option B — Railway

1. [railway.app](https://railway.app) → New Project → **Deploy from GitHub**
2. PostgreSQL-Plugin hinzufügen
3. Service: Docker Image `directus/directus:11.3.5`, Umgebungsvariablen wie in [`docker-compose.yml`](../docker-compose.yml)
4. `PUBLIC_URL` = Railway-URL, gleiche Setup-Befehle wie oben

---

## Option C — Eigene Domain (professioneller)

1. CMS unter z. B. `cms.caritas-zuerich.ch` (CNAME → Render/Railway)
2. `PUBLIC_URL` und `CORS_ORIGIN` auf Ihre Website-Domain setzen
3. Optional: Cloudflare davor für SSL

---

## Rollen

| Rolle | Wer | Zugriff |
|-------|-----|---------|
| **Administrator** | Sie / IT | Alles inkl. Familien & Spender |
| **Redakteur** | Freiwillige | Texte, Wünsche, Partner, Kampagnenstatus |

Redakteur-Rolle anlegen: `npm run directus:roles`  
Neues Redakteur-Konto: `npm run directus:create-editor -- --email ... --first-name ...`

---

## Checkliste vor Weitergabe

- [ ] HTTPS-URL funktioniert (`/admin` lädt)
- [ ] Redakteur kann sich anmelden
- [ ] Redakteur sieht **keine** Family/Kid/Donor-Daten mit PII
- [ ] Test: Info-Seite in Directus ändern → Website zeigt neuen Text (nach Deploy/ISR)
- [ ] Passwort nicht per unverschlüsselter E-Mail senden
