import type { Collections } from "~/types/collection";
import fetcher from "~/lib/fetcher";
import { useSearchParams } from "@remix-run/react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { SWRInfiniteKeyLoader } from "swr/infinite";
import useSWRInfinite from "swr/infinite";
import setParams from "~/lib/params";
import type { paths } from "@reservoir0x/reservoir-kit-client";

const baseURL =
  typeof process !== "undefined"
    ? process.env.RESERVOIR_BASE_URL
    : window.ENV.RESERVOIR_BASE_URL;

export default function usePaginatedCollections(fallback?: Collections) {
  const { ref, inView } = useInView();

  const pathname = `${baseURL ?? "https://api.reservoir.tools"}/collections/v5`;
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sort") ?? "allTimeVolume";

  const collections = useSWRInfinite<Collections>(
    (index, previousPageData) =>
      getKey(pathname, sortBy, index, previousPageData),
    fetcher,
    {
      revalidateFirstPage: false,
      fallbackData: [
        {
          collections: fallback?.collections,
        },
      ],
    }
  );

  // Fetch more data when component is visible
  useEffect(() => {
    if (inView) {
      collections.setSize(collections.size + 1);
    }
  }, [inView]);

  return { collections, ref };
}

const getKey: (
  pathname: string,
  sortBy: string | undefined,
  ...base: Parameters<SWRInfiniteKeyLoader>
) => ReturnType<SWRInfiniteKeyLoader> = (
  pathname: string,
  sortBy: string | undefined,
  index: number,
  previousPageData: Collections
) => {
  // Reached the end
  if (previousPageData && !previousPageData?.continuation) return null;

  let query: paths["/collections/v5"]["get"]["parameters"]["query"] = {
    limit: 20,
    sortBy: "1DayVolume",
  };

  if (previousPageData) query.continuation = previousPageData.continuation;

  if (sortBy === "30DayVolume" || sortBy === "7DayVolume")
    query.sortBy = sortBy;

  const href = setParams(pathname, query);

  return href;
};
