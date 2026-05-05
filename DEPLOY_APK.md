# APK Distribution Runbook

This runbook covers generating and publishing the Android APK so users can install ASTRA MATRIX from your landing page.

## 1) Build the APK with EAS

Use the preview profile for downloadable APK output:

```bash
npm ci
npm run build:apk
```

Use production profile when you are ready for release-grade signing controls:

```bash
npm run build:apk:production
```

## 2) Retrieve the build artifact

After `eas build` completes, download the generated APK and rename it:

```bash
astra-matrix-latest.apk
```

## 2.5) Publish artifact + metadata in one command

Use the helper script to copy a real APK into the landing download path and generate checksum metadata:

```bash
scripts/publish-apk-release.sh /path/to/your-real.apk 1.0.0 2026-05-05T08:00:00Z "Initial public APK release"
```

This updates:

- `public/download/astra-matrix-latest.apk`
- `public/download/latest.json`

The landing page reads `latest.json` to show version/build date/size/SHA256.

## 3) Publish on your server

Upload the APK to your web root so it is publicly available at:

```text
/download/astra-matrix-latest.apk
```

Your landing page already links to this path.

## 4) Recommended web server headers for APK

Set these response headers for the APK file:

- `Content-Type: application/vnd.android.package-archive`
- `Content-Disposition: attachment; filename="astra-matrix-latest.apk"`

## 5) Post-release smoke test

From an Android device:

1. Open landing page
2. Tap **Download APK**
3. Install package
4. Launch app and verify startup scene renders without crash

## 6) Security and signing reminders

- Keep EAS signing credentials backed up and access-controlled.
- Never embed private keys or long-lived API secrets directly in the mobile client.
- If Gemini integration is required in production, use a backend proxy/API and not a raw client-side secret.
