# VeloraChat Business Pack

This document is your single source of truth for packaging the business materials for your app.

## Product identity
- **App name:** VeloraChat
- **Style system:** Lunar Glass
- **Tagline:** Private moments, elegant flow.
- **Emblem concept:** Chat bubble with 3 message dots and a glow orbit.

## Business files included in the pack
- `docs/BRAND_KIT.md` — brand voice, colors, and emblem guidance.
- `docs/APP_STORE_SUBMISSION_CHECKLIST.md` — practical submission checklist.
- `docs/README.md` — quick-start and packaging instructions.
- `frontend/index.html` — visual concept screen and iPhone-style preview.

## How to generate the ZIP package

```bash
bash deploy/package_business_files.sh
```

Output archive:

- `dist/velorachat-business-pack.zip`

## Recommended owner workflow
1. Keep brand decisions in `docs/BRAND_KIT.md`.
2. Track release readiness in `docs/APP_STORE_SUBMISSION_CHECKLIST.md`.
3. Regenerate the ZIP whenever files are updated.


## Owner pack output
Use `bash deploy/build_owner_pack.sh` to keep an always-updated folder at `pack/velorachat-owner-pack/` plus a ZIP in `dist/`.
