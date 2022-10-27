import { setNonceToSession } from "~/session.server";
import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  return setNonceToSession(request);
}
