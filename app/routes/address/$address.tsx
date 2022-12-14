import { Outlet } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { requireUserAddress } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userAddress = await requireUserAddress(request);

  if (!userAddress) {
    throw new Response("Not Found", { status: 404 });
  }

  return null;
}

export default function CollectionDetailsPage() {
  return (
    <div className="min-h-screen w-full bg-primary-blue">
      <div className="relative mx-auto min-h-screen w-full px-4 pt-8 pb-6 flex-col sm:pt-28 tracking-wider text-white sm:flex sm:max-w-screen-2xl sm:px-32 sm:pb-16">
        <Outlet />
      </div>
    </div>
  );
}
