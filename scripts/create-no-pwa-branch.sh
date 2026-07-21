#!/usr/bin/env bash
# Strips PWA artifacts from ends-well for the no-pwa teaching branch.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Removing PWA files from ends-well..."

rm -f ngsw-config.json public/manifest.webmanifest

# Remove service worker provider from app.config.ts
node <<'NODE'
const fs = require('fs');
const path = 'src/app/app.config.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  /import \{ ApplicationConfig, provideZonelessChangeDetection, isDevMode \} from '@angular\/core';/,
  "import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';"
);
content = content.replace(
  /import \{ provideServiceWorker \} from '@angular\/service-worker';\n\n/,
  ''
);
content = content.replace(
  /\s*provideServiceWorker\('ngsw-worker\.js', \{[^}]+\}\),?\n/,
  '\n'
);
fs.writeFileSync(path, content);
NODE

# Remove serviceWorker from angular.json
node <<'NODE'
const fs = require('fs');
const path = 'angular.json';
const config = JSON.parse(fs.readFileSync(path, 'utf8'));
const options = config.projects['ends-well'].architect.build.options;
delete options.serviceWorker;
fs.writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
NODE

# Remove PWA tags from index.html
node <<'NODE'
const fs = require('fs');
const path = 'src/index.html';
let content = fs.readFileSync(path, 'utf8');
content = content
  .replace(/\s*<link rel="manifest" href="manifest\.webmanifest">/, '')
  .replace(/\s*<meta name="theme-color" content="[^"]*">/, '')
  .replace(/\s*<meta name="apple-mobile-web-app-capable" content="yes">/, '')
  .replace(/\s*<meta name="apple-mobile-web-app-status-bar-style" content="[^"]*">/, '')
  .replace(/\s*<noscript>[^<]*<\/noscript>/, '');
fs.writeFileSync(path, content);
NODE

node scripts/strip-update-ui.mjs

echo "Done. ends-well is now a no-PWA baseline."
echo "Run: npm install && npm run build"
