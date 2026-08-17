#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${ROOT_DIR}/dist"
OUT_FILE="${DIST_DIR}/velorachat-business-pack.zip"

mkdir -p "${DIST_DIR}"

cd "${ROOT_DIR}"

zip -r "${OUT_FILE}" \
  docs/README.md \
  docs/BUSINESS_PACK.md \
  docs/APP_STORE_SUBMISSION_CHECKLIST.md \
  docs/BRAND_KIT.md \
  frontend/index.html \
  backend/app.py \
  deploy/deploy.sh \
  qna_plugin/whisper_bot.js >/dev/null

echo "Business pack created: ${OUT_FILE}"
