import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCollection } from "~/models/collection.server";
import { useTokens } from "@reservoir0x/reservoir-kit-ui";
import type { CustomCollection } from "~/types/collection";
import { useGlobalStateUpdater } from "~/context";
import React from "react";
import { requireUserAddress } from "~/session.server";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import TokenCard from "~/components/CustomCollection/TokenCard";
import { RiEdit2Fill } from "react-icons/ri";
import TokenDetail from "~/components/CustomCollection/TokenDetail";

export async function loader({ request, params }: LoaderArgs) {
  const userAddress = await requireUserAddress(request);
  const { collectionId } = params;
  invariant(collectionId, "Collection not found");

  if (!userAddress) {
    throw new Response("Not Found", { status: 404 });
  }
  const collection = await getCollection({
    id: collectionId,
    userAddress,
  });
  if (!collection) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ collection });
}

export default function CollectionDetailsPage() {
  const { collection } = useLoaderData<typeof loader>();
  const actions = useGlobalStateUpdater();
  const { data: tokens } = useTokens({
    tokens: (collection as CustomCollection)?.tokens?.map(
      (t) => `${t?.contract}:${t?.token}`
    ),
  });

  //@ts-ignore
  const mappedTokens = tokens?.map(({ token, market }) => ({
    ...token,
    id: token.tokenId,
    market,
  }));

  React.useEffect(() => {
    if (mappedTokens.length) {
      actions.updateDraftCollection({
        title: collection?.title,
        items: mappedTokens,
      });
    }
  }, [mappedTokens, collection, actions]);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4">
      <div className="flex w-full w-full items-center justify-between">
        <h3 className="text-xl underline dark:text-white sm:text-3xl">
          {collection.title}
        </h3>

        <Link
          to={`/collections/${collection.id}/edit`}
          title="Create Collection"
          className="group flex items-center justify-center gap-2 text-sm hover:underline sm:text-xl"
        >
          Edit
          <span className="rounded-full rounded-full border-2 border-neon-pink from-neon-purple to-neon-pink p-1 p-0.5 text-sm text-neon-pink group-hover:bg-gradient-to-tr group-hover:text-white">
            <RiEdit2Fill />
          </span>
        </Link>
      </div>
      <ScrollArea.Root className="mt-4 box-border h-[700px] w-full overflow-hidden rounded bg-secondary-blue p-4">
        <ScrollArea.Viewport className="flex h-full w-full">
          <div className="grid w-full grid-cols-1 items-start items-start justify-items-center gap-2 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {mappedTokens?.map((item, index) => (
              <TokenDetail key={item?.id} token={item}>
                <TokenCard tokenInfo={item} index={index} mode="view" />
              </TokenDetail>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Collection not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
