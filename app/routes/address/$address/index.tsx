import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData, Link } from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  deleteCollection,
  getCollectionListItems,
} from "~/models/collection.server";
import { requireUserAddress } from "~/session.server";
import { RiAddCircleLine } from "react-icons/ri";
import CollectionCard from "~/components/CustomCollection/CollectionCard";
import type { CustomCollection } from "~/types/collection";

export async function loader({ request, params }: LoaderArgs) {
  const userAddress = await requireUserAddress(request);
  invariant(params.address, "Address not found");

  if (!userAddress) {
    throw new Response("Not Found", { status: 404 });
  }
  const collections = await getCollectionListItems({ userAddress });
  return json({ collections, address: params.address });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const collectionId = formData.get("collectionId");
  const userAddress = await requireUserAddress(request);
  invariant(collectionId, "collectionId not found");

  await deleteCollection({ userAddress, id: String(collectionId) });

  return null;
}

export default function CollectionDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex w-full justify-between py-8">
        <h3 className="text-xl font-bold sm:text-3xl">My Collections</h3>
        <Link
          to={`/collections/new`}
          title="Create Collection"
          className="flex items-center justify-center rounded-full bg-gradient-to-tr from-neon-purple to-neon-pink p-0.5 text-xl sm:text-3xl"
        >
          <RiAddCircleLine />
        </Link>
      </div>
      {data.collections.length > 0 ? (
        <div className="flex w-full flex-col gap-4 rounded-md bg-secondary-blue p-3 md:p-6">
          {data.collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection as CustomCollection}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-14 text-primary-blue">
          <h4 className="text-2xl">You have no Collections yet</h4>
          <p className="text-xl">Create your first one!</p>
        </div>
      )}
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Address not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
