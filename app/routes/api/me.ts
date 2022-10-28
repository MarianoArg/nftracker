import { json } from "@remix-run/node";
import { getUserAddress } from "~/session.server";
import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const address = await getUserAddress(request);

  return json({ address });
}
