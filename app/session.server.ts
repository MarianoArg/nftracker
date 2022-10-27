import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { User } from "~/models/user.server";
import { getUserByAddress, getOrcreateUser } from "~/models/user.server";
import type { SiweMessage } from "siwe";
import { generateNonce } from "siwe";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "siwe",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "siwe";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserAddress(
  request: Request
): Promise<User["address"] | undefined> {
  const session = await getSession(request);
  const sessionInfo = session.get(USER_SESSION_KEY);

  return sessionInfo?.address;
}

export async function getUser(request: Request) {
  const address = await getUserAddress(request);
  if (address === undefined) return null;

  const user = await getUserByAddress(address);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserAddress(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userAddress = await getUserAddress(request);
  if (!userAddress) {
    throw redirect(`/`);
  }
  return userAddress;
}

export async function requireUser(request: Request) {
  const userAddress = await requireUserAddress(request);

  const user = await getUserByAddress(userAddress);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  fields,
}: {
  request: Request;
  fields: Partial<SiweMessage>;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, fields);
  await getOrcreateUser(fields?.address as string);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function setNonceToSession(request: Request) {
  const session = await getSession(request);
  const nonce = generateNonce();
  session.set("nonce", nonce);
  return new Response(nonce, {
    status: 200,
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
      "Content-Type": "text/plain",
    },
  });
}
