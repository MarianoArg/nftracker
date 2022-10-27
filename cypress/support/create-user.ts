// Use this to create a new user and login with that user
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts username@example.com
// and it will log out the cookie value you can use to interact with the server
// as that new user.
import { v4 as uuidv4 } from "uuid";
import { installGlobals } from "@remix-run/node";
import { parse } from "cookie";

import { createUserSession } from "~/session.server";

installGlobals();

async function createAndLogin(address: string) {
  if (!address) {
    throw new Error("address required for login");
  }

  const response = await createUserSession({
    request: new Request("test://test"),
    fields: {
      address,
      nonce: uuidv4(),
      uri: "exampleuri",
      domain: "testdomain",
      version: "2",
      chainId: 12,
      issuedAt: Date.now().toString(),
    },
  });

  const cookieValue = response.headers.get("Set-Cookie");
  if (!cookieValue) {
    throw new Error("Cookie missing from createUserSession response");
  }
  const parsedCookie = parse(cookieValue);
  // we log it like this so our cypress command can parse it out and set it as
  // the cookie value.
  console.log(
    `
<cookie>
  ${parsedCookie.__session}
</cookie>
  `.trim()
  );
}

createAndLogin(process.argv[2]);
