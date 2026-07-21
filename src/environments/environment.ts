/**
 * Production environment configuration.
 *
 * The book sample uses mock data in production builds so readers can
 * follow along without a TMDb token. For a real deployment, proxy API
 * calls through your own backend.
 */
export const environment = {
  production: true,
  useMockData: true,
  useProxy: false,
  tmdbAccessToken: '',
};
