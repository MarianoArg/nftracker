/**
 * swr's fetcher function. [Reference](https://swr.vercel.app/docs/data-fetching#fetch)
 * @param href An url to be fetched
 * @returns The API's response
 */
export default async function fetcher(href: string) {
  const options: RequestInit | undefined = {};

  const reservoirApiKey =
    typeof process !== "undefined"
      ? process.env.RESERVOIR_API_KEY
      : // @ts-ignore
        window.ENV.RESERVOIR_API_KEY;

  if (reservoirApiKey) {
    options.headers = {
      "x-api-key": reservoirApiKey,
    };
  }
  const res = await fetch(href, options);
  return res.json();
}
