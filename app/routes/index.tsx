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
    <div className="min-h-screen w-full bg-[#100E1A]">
      <main className="relative min-h-screen w-full flex-col sm:flex sm:items-center sm:justify-center">
        <div className="relative mt-8 flex w-full justify-between sm:mt-20 sm:max-w-screen-2xl sm:px-32 sm:pb-16 sm:pt-8">
          <div className="w-9/12 text-7xl text-white sm:max-w-[700px]">
            <h2>
              Create and Track your own{" "}
              <span className="bg-gradient-to-r from-[#CE66ED] to-[#7F6BC8] bg-clip-text text-transparent">
                NFT
              </span>{" "}
              collections.
            </h2>
          </div>
        </div>
        <div className="relative flex w-full flex-col justify-between sm:max-w-screen-2xl sm:px-32 sm:pb-16 sm:pt-8">
          <div className="mb-9 flex w-full items-center justify-between">
            <h3 className="text-3xl dark:text-white">Trending Collections</h3>
            {!isSmallDevice && <SortTrendingCollections />}
          </div>
          <div className="w-full rounded-md bg-gradient-to-tr from-[#622ADB] to-[#CE66ED] p-px sm:max-w-screen-2xl">
            <div className="rounded-md bg-[#22263c] p-8">
              <TrendingCollectionTable fallback={data.fallback} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
