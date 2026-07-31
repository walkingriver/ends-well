#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, 'src/assets/icons/icon-source.svg');
const outputDir = path.join(rootDir, 'src/assets/splash');
const indexPath = path.join(rootDir, 'src/index.html');
const backgroundColor = '#f5f5f5';

/** iOS startup image sizes (matches common pwa-asset-generator output). */
const SPLASH_SCREENS = [
  { width: 2048, height: 2732, media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 2732, height: 2048, media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  { width: 1668, height: 2388, media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 2388, height: 1668, media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  { width: 1536, height: 2048, media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 2048, height: 1536, media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  { width: 1488, height: 2266, media: '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 2266, height: 1488, media: '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  { width: 1640, height: 2360, media: '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 2360, height: 1640, media: '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  { width: 1668, height: 2224, media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 2224, height: 1668, media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  { width: 1620, height: 2160, media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 2160, height: 1620, media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  { width: 1320, height: 2868, media: '(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  { width: 2868, height: 1320, media: '(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  { width: 1206, height: 2622, media: '(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  { width: 2622, height: 1206, media: '(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  { width: 1290, height: 2796, media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  { width: 2796, height: 1290, media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  { width: 1179, height: 2556, media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  { width: 2556, height: 1179, media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  { width: 1284, height: 2778, media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  { width: 2778, height: 1284, media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  { width: 1170, height: 2532, media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  { width: 2532, height: 1170, media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  { width: 1125, height: 2436, media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  { width: 2436, height: 1125, media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  { width: 1242, height: 2688, media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  { width: 2688, height: 1242, media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  { width: 828, height: 1792, media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 1792, height: 828, media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  { width: 1242, height: 2208, media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  { width: 2208, height: 1242, media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  { width: 750, height: 1334, media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 1334, height: 750, media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  { width: 640, height: 1136, media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  { width: 1136, height: 640, media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
];

async function renderSplash(width, height) {
  const iconSize = Math.round(Math.min(width, height) * 0.22);
  const icon = await sharp(sourcePath).resize(iconSize, iconSize).png().toBuffer();
  const left = Math.round((width - iconSize) / 2);
  const top = Math.round((height - iconSize) / 2);

  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: backgroundColor,
    },
  })
    .composite([{ input: icon, left, top }])
    .jpeg({ quality: 85 })
    .toBuffer();
}

async function patchIndexHtml() {
  let html = await fs.readFile(indexPath, 'utf8');
  html = html.replace(/<link rel="apple-touch-startup-image"[^>]*>\s*/g, '');

  const splashTags = SPLASH_SCREENS.map(
    ({ width, height, media }) =>
      `    <link rel="apple-touch-startup-image" href="assets/splash/apple-splash-${width}-${height}.jpg" media="${media}">`,
  ).join('\n');

  if (html.includes('assets/icons/apple-icon-180.png')) {
    html = html.replace(
      /(<link rel="apple-touch-icon" href="assets\/icons\/apple-icon-180\.png">)/,
      `$1\n${splashTags}`,
    );
  } else {
    html = html.replace(/<\/head>/, `${splashTags}\n  </head>`);
  }

  await fs.writeFile(indexPath, html);
}

async function main() {
  await fs.access(sourcePath);
  await fs.mkdir(outputDir, { recursive: true });

  for (const { width, height } of SPLASH_SCREENS) {
    const filename = `apple-splash-${width}-${height}.jpg`;
    const buffer = await renderSplash(width, height);
    await fs.writeFile(path.join(outputDir, filename), buffer);
  }

  await patchIndexHtml();
  console.log(`Generated ${SPLASH_SCREENS.length} iOS splash images in src/assets/splash/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
