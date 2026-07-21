#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, 'src/assets/icons/icon-source.svg');
const outputDir = path.join(rootDir, 'src/assets/icons');
const indexPath = path.join(rootDir, 'src/index.html');
const manifestPath = path.join(rootDir, 'public/manifest.webmanifest');
const themeColor = '#3f51b5';

async function renderPng(size, { maskable = false } = {}) {
  const source = await sharp(sourcePath).resize(1024, 1024).png().toBuffer();

  if (!maskable) {
    return sharp(source).resize(size, size).png().toBuffer();
  }

  const inner = Math.round(size * 0.72);
  const inset = Math.round((size - inner) / 2);
  const icon = await sharp(source).resize(inner, inner).png().toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: themeColor,
    },
  })
    .composite([{ input: icon, left: inset, top: inset }])
    .png()
    .toBuffer();
}

async function writeIcon(filename, size, options) {
  const buffer = await renderPng(size, options);
  await fs.writeFile(path.join(outputDir, filename), buffer);
}

async function patchIndexHtml() {
  let html = await fs.readFile(indexPath, 'utf8');

  html = html.replace(
    /<link rel="icon"[^>]*>\s*/g,
    '',
  );
  html = html.replace(
    /<link rel="apple-touch-icon"[^>]*>\s*/g,
    '',
  );
  html = html.replace(
    /<link rel="apple-touch-startup-image"[^>]*>\s*/g,
    '',
  );

  const iconTags = [
    '    <link rel="icon" type="image/png" sizes="196x196" href="assets/icons/favicon-196.png">',
    '    <link rel="apple-touch-icon" href="assets/icons/apple-icon-180.png">',
  ].join('\n');

  if (!html.includes('assets/icons/favicon-196.png')) {
    html = html.replace(
      /(<link href="https:\/\/fonts\.googleapis\.com\/icon\?family=Material\+Icons" rel="stylesheet">)/,
      `$1\n${iconTags}`,
    );
  }

  await fs.writeFile(indexPath, html);
}

async function patchManifest() {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  manifest.icons = [
    {
      src: 'assets/icons/manifest-icon-192.maskable.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'assets/icons/manifest-icon-192.maskable.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: 'assets/icons/manifest-icon-512.maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'assets/icons/manifest-icon-512.maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ];
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

async function main() {
  await fs.access(sourcePath);

  await writeIcon('icon-512x512.png', 512);
  await writeIcon('manifest-icon-192.maskable.png', 192, { maskable: true });
  await writeIcon('manifest-icon-512.maskable.png', 512, { maskable: true });
  await writeIcon('apple-icon-180.png', 180);
  await writeIcon('favicon-196.png', 196);

  await patchIndexHtml();
  await patchManifest();

  console.log('Generated PWA icons from src/assets/icons/icon-source.svg');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
