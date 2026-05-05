#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  scripts/publish-apk-release.sh <apk_source_path> <version> [build_date_utc] [release_notes]

Example:
  scripts/publish-apk-release.sh ~/Downloads/app-release.apk 1.2.0 2026-05-05T07:30:00Z "Stability improvements"
USAGE
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

if [ "$#" -lt 2 ]; then
  usage
  exit 1
fi

APK_SOURCE="$1"
VERSION="$2"
BUILD_DATE="${3:-$(date -u +"%Y-%m-%dT%H:%M:%SZ")}"
RELEASE_NOTES="${4:-Release ${VERSION}}"
TARGET_DIR="public/download"
TARGET_APK="${TARGET_DIR}/astra-matrix-latest.apk"
TARGET_META="${TARGET_DIR}/latest.json"

if [ ! -f "${APK_SOURCE}" ]; then
  echo "APK source file not found: ${APK_SOURCE}" >&2
  exit 1
fi

mkdir -p "${TARGET_DIR}"
if [ "$(realpath "${APK_SOURCE}")" != "$(realpath "${TARGET_APK}")" ]; then
  cp "${APK_SOURCE}" "${TARGET_APK}"
fi

FILE_SIZE_BYTES="$(wc -c < "${TARGET_APK}" | tr -d ' ')"
SHA256="$(sha256sum "${TARGET_APK}" | awk '{print $1}')"

json_escape() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

VERSION_ESCAPED="$(json_escape "${VERSION}")"
BUILD_DATE_ESCAPED="$(json_escape "${BUILD_DATE}")"
NOTES_ESCAPED="$(json_escape "${RELEASE_NOTES}")"

cat > "${TARGET_META}" <<EOF
{
  "version": "${VERSION_ESCAPED}",
  "buildDate": "${BUILD_DATE_ESCAPED}",
  "fileName": "astra-matrix-latest.apk",
  "fileSizeBytes": ${FILE_SIZE_BYTES},
  "sha256": "${SHA256}",
  "minAndroidSdk": 24,
  "releaseNotes": "${NOTES_ESCAPED}"
}
EOF

echo "Published APK metadata:"
echo "  File: ${TARGET_APK}"
echo "  Version: ${VERSION}"
echo "  Build date: ${BUILD_DATE}"
echo "  Size: ${FILE_SIZE_BYTES} bytes"
echo "  SHA256: ${SHA256}"
echo "  Metadata: ${TARGET_META}"
