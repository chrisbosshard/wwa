# Directus backend for Weihnachtswunschaktion 2026

**For non-developers:** share the online admin URL + login (see [ANLEITUNG-REDAKTEUR.md](./ANLEITUNG-REDAKTEUR.md)).

**To put CMS online:** follow [ONLINE-EINRICHTEN.md](./ONLINE-EINRICHTEN.md) (Render one-click deploy).

## Local development

```bash
# 1. Copy env and start Directus + PostgreSQL
cp .env.example .env
docker compose up -d

# 2. Open http://localhost:8055 and log in with DIRECTUS_ADMIN_EMAIL / DIRECTUS_ADMIN_PASSWORD

# 3. Apply schema (collections, fields, relations)
npm run directus:setup

# 4. Migrate data from Hygraph (optional, requires HYGRAPH_TOKEN in .env)
npm run migrate:hygraph

# 5. Seed CMS pages and sponsors from hardcoded content
npm run seed:cms

# 5b. Seed homepage texts per campaign state (if collection already exists)
npm run seed:campaign-content

# 6. Create volunteer role and user (for sharing with non-developers)
npm run directus:roles
npm run directus:create-editor -- --email redakteur@example.com --first-name Max
```

## Production deployment

Deploy `docker-compose.yml` to Railway, Fly.io, or Azure Container Apps with managed PostgreSQL.

1. Set strong `DIRECTUS_SECRET`, `ADMIN_PASSWORD`, and `PUBLIC_URL`
2. Run `npm run directus:setup` against the production Directus URL
3. Create API tokens in Directus Admin → Settings → Access Tokens:
   - **Public read token** — read-only on wishes, categories, pages, sponsors, global_setting, application.state, campaign_content
   - **App token** — full CRUD for kid, family, donor (used by Next.js API routes only)
4. Set `DIRECTUS_TOKEN` in Next.js hosting env (never expose to browser)

## Roles (configure in Directus Admin)

| Role | Collections |
|------|-------------|
| Editor | page, sponsor, global_setting, wish, category, campaign_content (read/write) |
| Coordinator | wish, category, application, campaign_content, kid (status fields only) |
| Admin | All collections |

Field-level permissions: hide family email/phone/street and donor address from Editor role.

## Backups

Back up PostgreSQL before each campaign season. Directus uploads live in the `directus_uploads` volume or S3 bucket.
