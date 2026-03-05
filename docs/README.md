# VeloraChat Business + App Starter

This repository now includes a **business pack** and a **technical starter** so you can keep everything in your files and move toward iPhone App Store release.

## What is included

- Product concept screen: `frontend/index.html`
- Backend starter: `backend/app.py`
- Plugin scaffold: `qna_plugin/whisper_bot.js`
- Deployment helper: `deploy/deploy.sh`
- Business pack guide: `docs/BUSINESS_PACK.md`
- App Store checklist: `docs/APP_STORE_SUBMISSION_CHECKLIST.md`
- Brand kit: `docs/BRAND_KIT.md`

## Create the business pack ZIP in your files

Run:

```bash
bash deploy/package_business_files.sh
```

This generates:

- `dist/velorachat-business-pack.zip`

## Suggested next build steps

1. Implement messaging APIs + persistence.
2. Add Sign in with Apple and onboarding.
3. Add APNs push notifications.
4. Create native iOS project and integrate backend.
5. Complete App Store Connect metadata and privacy details.


## Owner-friendly pack (folder + ZIP)

Run:

```bash
bash deploy/build_owner_pack.sh
```

This refreshes a readable folder in your files:

- `pack/velorachat-owner-pack/`

And creates a shareable ZIP:

- `dist/velorachat-owner-pack.zip`
