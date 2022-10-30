import SortTrendingCollections from "~/components/SortTrendingCollections";
import TrendingCollectionTable from "~/components/TrendingCollectionTable";
import { useMediaQuery } from "@react-hookz/web";
import { json } from "remix-utils";
import setParams from "~/lib/params";
import type { paths } from "@reservoir0x/reservoir-kit-client";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import OvniSvg from "~/images/ovni.svg";

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
        <div className="relative flex w-full justify-between bg-cover px-6 py-6 sm:max-w-screen-2xl sm:pb-16 sm:pt-8 lg:px-32">
          <div className="flex items-center text-4xl text-white md:w-7/12 md:text-5xl lg:text-7xl xl:w-6/12">
            <h2>
              Create and Track your own{" "}
              <span className="bg-gradient-to-r from-neon-pink to-light-purple bg-clip-text text-transparent">
                NFT
              </span>{" "}
              collections.
            </h2>
          </div>
          <div className="flex max-w-[500px] grow items-center justify-center xl:w-5/12">
            <img
              className="mix-blend-plus-lighter"
              alt="By upklyak on Freepik"
              src={OvniSvg}
            />
          </div>
        </div>
        <div className="relative flex w-full flex-col justify-between px-6 sm:max-w-screen-2xl sm:pb-16 sm:pt-8 lg:px-32">
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
      <div className="text-center text-[8px] text-slate-800">
        <a href="https://www.freepik.com/free-vector/alien-spaceship-ufo-game-icons-vector-set_30699561.htm#query=neon%20rocket&position=5&from_view=keyword">
          Image by upklyak
        </a>{" "}
        on Freepik
      </div>
    </div>
  );
}
