import { json } from "@remix-run/node";
import { SiweMessage } from "siwe";
import { createUserSession, getSession } from "~/session.server";
import type { ActionArgs } from "@remix-run/node";

export async function action({ request }: ActionArgs) {
  const { message, signature } = await request.json();
  const session = await getSession(request);
  const siweMessage = new SiweMessage(message);

  try {
    const nonce = session.get("nonce");
    const fields = await siweMessage.validate(signature);
    if (fields.nonce !== nonce) {
      return json({ message: "Invalid nonce." }, { status: 422 });
    }
    return createUserSession({ request, fields });
  } catch (_error) {
    return json({ ok: false });
  }
}
