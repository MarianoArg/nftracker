export function getEnv() {
  return {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    RESERVOIR_BASE_URL: process.env.RESERVOIR_BASE_URL,
    RESERVOIR_API_KEY: process.env.RESERVOIR_API_KEY,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    PUBLIC_ENABLE_TESTNETS: process.env.PUBLIC_ENABLE_TESTNETS,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
