#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACK_DIR="${ROOT_DIR}/pack/velorachat-owner-pack"
DIST_DIR="${ROOT_DIR}/dist"
ZIP_FILE="${DIST_DIR}/velorachat-owner-pack.zip"

mkdir -p "${PACK_DIR}/brand" "${PACK_DIR}/app-store" "${DIST_DIR}"

cp "${ROOT_DIR}/docs/BRAND_KIT.md" "${PACK_DIR}/brand/BRAND_KIT.md"
cp "${ROOT_DIR}/docs/APP_STORE_SUBMISSION_CHECKLIST.md" "${PACK_DIR}/app-store/APP_STORE_SUBMISSION_CHECKLIST.md"
cp "${ROOT_DIR}/frontend/index.html" "${PACK_DIR}/product-preview.html"

cd "${ROOT_DIR}/pack"
zip -r "${ZIP_FILE}" "velorachat-owner-pack" >/dev/null

echo "Owner pack refreshed at: ${PACK_DIR}"
echo "Owner pack zip created: ${ZIP_FILE}"
