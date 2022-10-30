import SortTrendingCollections from "~/components/SortTrendingCollections";
import TrendingCollectionTable from "~/components/TrendingCollectionTable";
import { useMediaQuery } from "@react-hookz/web";
import { json } from "remix-utils";
import setParams from "~/lib/params";
import type { paths } from "@reservoir0x/reservoir-kit-client";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const options: RequestInit | undefined = {};

  const reservoirApiKey =
    typeof process !== "undefined"
      ? process.env.RESERVOIR_API_KEY
      : window.ENV.RESERVOIR_API_KEY;

  if (reservoirApiKey) {
    options.headers = {
      "x-api-key": reservoirApiKey,
      "Access-Control-Allow-Origin": "*",
    };
  }

  const baseURL =
    typeof process !== "undefined"
      ? process.env.RESERVOIR_BASE_URL
      : window.ENV.RESERVOIR_BASE_URL;

  const url = new URL("/collections/v5", baseURL);

  let query: paths["/collections/v5"]["get"]["parameters"]["query"] = {
    limit: 20,
    sortBy: "1DayVolume",
  };

  const href = setParams(url, query);
  const res = await fetch(href, options);

  const collections = await res.json();

  return json({
    fallback: {
      collections,
    },
  });
}

export default function Index() {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 600px)");
  const data = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen w-full bg-primary-blue">
      <main className="relative min-h-screen w-full flex-col sm:flex sm:items-center sm:justify-center">
        <div className="relative mt-8 flex w-full justify-between px-8 pb-6 sm:mt-20 sm:max-w-screen-2xl sm:px-32 sm:pb-16 sm:pt-8">
          <div className="w-9/12 text-4xl text-white sm:max-w-[700px] md:text-5xl lg:text-7xl">
            <h2>
              Create and Track your own{" "}
              <span className="bg-gradient-to-r from-neon-pink to-light-purple bg-clip-text text-transparent">
                NFT
              </span>{" "}
              collections.
            </h2>
          </div>
        </div>
        <div className="relative flex w-full flex-col justify-between px-8 sm:max-w-screen-2xl sm:px-32 sm:pb-16 sm:pt-8">
          <div className="mb-4 flex w-full items-center justify-between md:mb-9">
            <h3 className="text-xl dark:text-white md:text-3xl">
              Trending Collections
            </h3>
            {!isSmallDevice && <SortTrendingCollections />}
          </div>
          <div className="w-full rounded-md bg-gradient-to-tr from-neon-purple to-neon-pink p-px sm:max-w-screen-2xl">
            <div className="rounded-md bg-secondary-blue p-8">
              <TrendingCollectionTable fallback={data.fallback} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
