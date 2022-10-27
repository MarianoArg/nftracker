import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCollection, updateCollection } from "~/models/collection.server";
import { getUserAddress, requireUserAddress } from "~/session.server";
import CollectionBuilder from "~/components/CustomCollection/CollectionBuilder";
import { useTokens } from "@reservoir0x/reservoir-kit-ui";
import type { CustomCollection } from "~/types/collection";
import { useGlobalStateUpdater } from "~/context";
import React from "react";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("collection_name");
  const id = formData.get("id");
  const items = JSON.parse(formData.get("items") as string);
  const userAddress = await getUserAddress(request);
  const collections = items?.map((c) => c.token);
  if (items.length === 0) {
    invariant(items, "No collections selected");
  }
  if (!id) {
    invariant(id, "No collection provided");
  }
  const options: RequestInit | undefined = {
    method: "POST",
    body: JSON.stringify({ collections }),
    headers: {
      "Content-Type": "application/json",
    },
  };
  const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY;
  const RESERVOIR_BASE_URL = process.env.RESERVOIR_BASE_URL;

  if (RESERVOIR_API_KEY) {
    options.headers = {
      ...options.headers,
      "x-api-key": RESERVOIR_API_KEY,
    };
  }

  // COLLECTION
  const collectionUrl = new URL(`${RESERVOIR_BASE_URL}/collections-sets/v1`);

  const collectionRes = await fetch(collectionUrl.href, options);

  const response = await collectionRes.json();
  await updateCollection({
    id: id as string,
    setId: response?.collectionsSetId,
    title: title as string,
    isDraft: false,
    tokens: items,
  });

  return redirect(`/address/${userAddress}`);
}

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

  return mappedTokens.length ? (
    <CollectionBuilder
      tokens={mappedTokens}
      collectionId={collection?.id}
      collectionTitle={collection?.title}
    />
  ) : null;
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
