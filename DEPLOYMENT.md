# Deployment (Vercel + Directus)

## Architecture

Two services — both need a public HTTPS URL:

| Service | Host | Purpose |
|---------|------|---------|
| **Website** (Next.js) | **Vercel** | Public site, Stripe webhooks, API routes |
| **CMS / database** (Directus) | **Render, Railway, or Fly.io** | Admin UI for volunteers, PostgreSQL, file uploads |

Directus cannot run on Vercel (no long-running server, no persistent uploads). Vercel only hosts the Next.js app and calls Directus via env vars.

```
Volunteer  →  https://cms.example.com/admin     (Directus on Render/Railway)
Public     →  https://weihnachtswunsch.example.com (Vercel)
Next.js    →  DIRECTUS_URL / DIRECTUS_TOKEN       (server-side only)
```

---

## 1. Deploy Directus (CMS for non-developers)

Follow [directus/ONLINE-EINRICHTEN.md](./directus/ONLINE-EINRICHTEN.md) — Render or Railway, ~CHF 15–25/month.

After deploy you will have:

- `https://YOUR-DIRECTUS.onrender.com/admin` — share this with volunteers
- `ADMIN_TOKEN` — for the Next.js app (never expose in browser)

Run once from your machine:

```bash
export DIRECTUS_URL=https://YOUR-DIRECTUS.onrender.com
export DIRECTUS_ADMIN_PASSWORD=<from host dashboard>

npm run directus:setup
npm run directus:roles
npm run seed:cms
npm run directus:create-editor -- --email redakteur@caritas-zuerich.ch --first-name Vorname
```

On the Directus host, set:

- `PUBLIC_URL` = `https://YOUR-DIRECTUS.onrender.com`
- `CORS_ORIGIN` = `https://YOUR-VERCEL-DOMAIN.vercel.app,https://your-production-domain.ch`

---

## 2. Deploy website on Vercel

1. Push `wwa-2026` to GitHub
2. [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Framework: **Next.js** (auto-detected; `vercel.json` is already configured)
4. Set **Environment Variables** (Production + Preview):

| Variable | Value | Notes |
|----------|-------|-------|
| `DIRECTUS_URL` | `https://YOUR-DIRECTUS.onrender.com` | Server-only |
| `NEXT_PUBLIC_DIRECTUS_URL` | same as above | Asset URLs in browser |
| `DIRECTUS_TOKEN` | `ADMIN_TOKEN` from Directus host | Server-only — API routes |
| `NEXT_PUBLIC_CAMPAIGN_SEASON_START` | e.g. `2025-08-30T00:00:00+00:00` | Season filter |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | |
| `STRIPE_SECRET_KEY` | Stripe secret | |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook pointing to Vercel | URL: `https://YOUR-SITE.vercel.app/api/webhook` |
| `POSTMARK_API_TOKEN` | Postmark | |
| `POSTMARK_REGISTRATION_TEMPLATE` | Template ID | |
| `POSTMARK_SUCCESS_TEMPLATE` | Template ID | |
| `NEXT_PASSWORD_ADMIN` | Admin page password | |

5. Deploy

### Stripe webhook on Vercel

In Stripe Dashboard → Webhooks → add endpoint:

`https://YOUR-PRODUCTION-DOMAIN.ch/api/webhook`

Use the signing secret as `STRIPE_WEBHOOK_SECRET` in Vercel.

### Custom domain (optional)

Vercel → Project → Domains → add `weihnachtswunsch.caritas-zuerich.ch` (or similar).

Update Directus `CORS_ORIGIN` to include that domain.

---

## 3. Share with non-developers

| Who | URL |
|-----|-----|
| Volunteer (content) | `https://YOUR-DIRECTUS.onrender.com/admin` |
| Public (website) | `https://YOUR-SITE.vercel.app` |

Guide: [directus/ANLEITUNG-REDAKTEUR.md](./directus/ANLEITUNG-REDAKTEUR.md)

---

## Local development

```bash
cp .env.example .env.local
npm run directus:up
npm run directus:setup
npm run directus:roles
npm run seed:cms
npm run dev
```

---

## Optional: Neon Postgres (Vercel integration)

You can use [Neon](https://neon.tech) (Vercel Storage integration) as the PostgreSQL database **for Directus**, while Directus itself still runs on Render/Railway:

1. Vercel → Storage → Neon → create database
2. Copy connection string into Directus `DB_*` env vars on Render/Railway

The Next.js app on Vercel does not connect to Postgres directly — only to Directus API.

---

## Cutover checklist

- [ ] Directus online, schema + roles + seed done
- [ ] Vercel env vars set, deploy green
- [ ] Stripe webhook hits Vercel `/api/webhook`
- [ ] Volunteer can log into Directus admin
- [ ] Test: edit page in Directus → visible on Vercel site
- [ ] Hygraph decommissioned after parallel run (if migrated)
