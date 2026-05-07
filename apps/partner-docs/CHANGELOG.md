# Changelog

## 2026-05-07

- Added a root multi-stage `Dockerfile` for the monorepo that installs workspace dependencies, builds `@heyzack/partner-docs`, and serves the docs app on port `3000`.
- Added a root `.dockerignore` to keep local dependencies, build output, and editor metadata out of the Docker build context.

## 2026-05-04

- Docs switcher: each app now fixes its own site identity (`partner` vs `crm`) so the active tab is never a link to localhost because of a wrong or copied `NEXT_PUBLIC_DOCS_SITE`.
- **Single host:** Partner and CRM docs are both served from `@heyzack/partner-docs` — `/docs` and `/docs/crm` — with two Fumadocs collections (`content/partner`, `content/crm`). Root `npm run dev` / `npm run build` target this app only.
- CRM doc screenshots live under `apps/partner-docs/public/` (same paths as the former `crm-docs` app).


## 2026-04-20

- Migrated documentation content from the Mintlify source export into `content/docs`.
- Added `meta.json` navigation files for all migrated sections and created `content/docs/index.mdx` for `/docs`.
- Updated branding/theme configuration in `lib/theme-config.ts` for HeyZack.
- Added internal-link normalization for MDX links and cards so Mintlify-style absolute paths resolve under `/docs`.
- Expanded MDX card icon mapping to cover all Mintlify icon names used in the migrated docs.
- Configured Next.js external image hosts for HeyZack branding assets.
- Added an MDX `script` element override to render as `<template>` and avoid client script execution warnings.
