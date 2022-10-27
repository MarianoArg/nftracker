import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useCatch } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createCollection } from "~/models/collection.server";
import { getUserAddress } from "~/session.server";
import CollectionBuilder from "~/components/CustomCollection/CollectionBuilder";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("collection_name");
  const items = JSON.parse(formData.get("items") as string);

  const userAddress = await getUserAddress(request);
  const tokenIds = items?.map((c) => c?.token);
  if (items.length === 0) {
    invariant(items, "No collections selected");
  }
  const options: RequestInit | undefined = {
    method: "POST",
    body: JSON.stringify({ contract: userAddress, tokenIds }),
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
  const collectionUrl = new URL(`${RESERVOIR_BASE_URL}/token-sets/v1`);

  const collectionRes = await fetch(collectionUrl.href, options);
  const response = await collectionRes.json();

  if (response?.id && userAddress) {
    await createCollection({
      userAddress,
      setId: response?.id,
      title: title as string,
      isDraft: false,
      tokens: items,
    });
  }

  return redirect(`/address/${userAddress}`);
}

export default function NewCollectionPage() {
  return <CollectionBuilder />;
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
