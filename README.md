# Ends Well

Companion demo for [_Developing Progressive Web Applications with Angular_](https://github.com/walkingriver/angular-pwa).

Angular 22 · Angular Material · standalone components · optional TMDb integration · PWA teaching branches.

## Requirements

- **Node.js** 22.22.3 or later (24.x works)
- npm 10+

## Quick start

```bash
git clone https://github.com/walkingriver/ends-well.git
cd ends-well
git checkout ends-well-no-pwa
npm install          # creates environment.development.ts from the example when missing
npm start
```

Open <http://localhost:4200>. The app runs on **mock data** by default.

## Teaching branches

| Branch / tag | Use when |
|--------------|----------|
| `ends-well-no-pwa` | PWA book: before `ng add @angular/pwa` |
| `ends-well-pwa` | PWA book: after adding PWA support |
| `ends-well-updates` | PWA book: updates chapters (`SwUpdate` UI) |
| **Angular Apprentice** | Build Ends Well from scratch; mock data default ch. 10–16; live TMDb ch. 17a–18; deploy ch. 21 (`npm run deploy`) |
| `apprentice-ch08-end` … `apprentice-ch18-end` | Compare your work at the end of each Apprentice chapter |
| `apprentice-ch21-end` | Production build deployed to Cloudflare Pages (code still `ends-well-no-pwa`) |

```bash
git checkout ends-well-no-pwa   # PWA book ch. 5
git checkout ends-well-pwa      # PWA book ch. 9+
git checkout ends-well-updates  # PWA book ch. 15+
git tag -l 'apprentice-ch*'     # Apprentice chapter checkpoints
```

## Live TMDb data (optional)

### Recommended: local proxy

Keeps your token off the browser.

```bash
cp proxy/.env.example proxy/.env
# Edit proxy/.env and paste your TMDb API Read Access Token

cp src/environments/environment.development.example.ts \
   src/environments/environment.development.ts
# Set useMockData: false and useProxy: true

npm run start:live
```

`start:live` runs the proxy on port 3001 and `ng serve` with `proxy.conf.json`.

### Alternative: browser token

Only for local experiments. The token is visible in DevTools.

```bash
cp src/environments/environment.development.example.ts \
   src/environments/environment.development.ts
# Paste token, set useMockData: false, useProxy: false

npm start
```

Never commit `proxy/.env` or `environment.development.ts`.

## Build and deploy

```bash
npm run build
```

Output: `dist/ends-well/browser/`

Test production locally:

```bash
npx http-server -p 8080 -c-1 dist/ends-well/browser
```

Deploy to Cloudflare Pages:

```bash
npm run deploy
```

## Maintainer scripts

```bash
./scripts/create-no-pwa-branch.sh   # strip PWA for ends-well-no-pwa
node scripts/strip-update-ui.mjs    # remove SwUpdate UI for ends-well-pwa
```
