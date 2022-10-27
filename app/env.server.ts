export function getEnv() {
  return {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    RESERVOIR_BASE_URL: process.env.RESERVOIR_BASE_URL,
    RESERVOIR_API_KEY: process.env.RESERVOIR_API_KEY,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
