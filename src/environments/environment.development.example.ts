/**
 * Development environment configuration.
 *
 * Option A — mock data (default):
 *   Leave useMockData: true. No TMDb account required.
 *
 * Option B — local proxy (recommended for live TMDb data):
 *   1. Copy proxy/.env.example to proxy/.env and add your token.
 *   2. Set useMockData: false and useProxy: true below.
 *   3. Run: npm run start:live
 *
 * Option C — browser token (not recommended):
 *   1. Paste your token into tmdbAccessToken below.
 *   2. Set useMockData: false and useProxy: false.
 *   3. Run: npm start
 *
 * SECURITY: A browser token is visible in DevTools. Prefer the proxy.
 */
export const environment = {
  production: false,
  useMockData: true,
  useProxy: false,
  tmdbAccessToken: 'PASTE_YOUR_TMDB_READ_ACCESS_TOKEN_HERE',
};
