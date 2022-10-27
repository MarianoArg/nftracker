import { faker } from "@faker-js/faker";
import { action as createCollectionAction } from "~/routes/collections/new";
import { redirect } from "@remix-run/node";

describe("smoke tests", () => {
  const userAddress = faker.finance.ethereumAddress();
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to create account and login with Wallet address", () => {
    const loginForm = {
      address: userAddress,
    };

    cy.then(() => ({ userAddress: loginForm.address })).as("user");

    cy.visitAndCheck("/");

    cy.findByRole("button", { name: userAddress }).click();

    cy.findByRole("link", { name: /Portfolio/i }).click();
    cy.findByText("My Collections");
    cy.findByRole("button", { name: /Disconnect/i }).click();
    cy.findByRole("button", { name: /Connect Wallet/i });
  });

  it("should create a collection", async () => {
    const testCollection = {
      title: faker.lorem.words(1),
      items: [
        {
          token: faker.random.numeric(4),
          contract: faker.finance.ethereumAddress(),
          order: faker.random.numeric(1),
        },
        {
          token: faker.random.numeric(4),
          contract: faker.finance.ethereumAddress(),
          order: faker.random.numeric(1),
        },
      ],
    };
    cy.login();

    cy.visitAndCheck("/");

    const body = new FormData();
    body.set("title", testCollection.title);
    body.set("items", JSON.stringify(testCollection.items));

    const request = new Request("/collections/new", {
      method: "POST",
      body,
    });
    const response = await createCollectionAction({
      request,
      params: {},
      context: {},
    });

    expect(response).equal(redirect(`/address/${userAddress}`));
  });
});
