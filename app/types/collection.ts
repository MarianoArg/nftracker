import type { paths } from "@reservoir0x/reservoir-kit-client";

export type Collections =
  paths["/collections/v5"]["get"]["responses"]["200"]["schema"];

export type CollectionResponse =
  paths["/collections/v5"]["get"]["responses"]["200"]["schema"]["collections"];

export type TokenResponse =
  paths["/tokens/v5"]["get"]["responses"]["200"]["schema"]["tokens"];

export type Collection = {
  id: string;
  name?: string;
  image?: string;
  banner?: string;
  createdAt?: string;
};

export type Market = {
  floorAsk?: {
    id: string;
    maker?: string;
    validFrom?: number;
    validUntil?: number;
    price: {
      amount: {
        raw?: string;
        decimal?: number;
        usd?: number;
        native?: number;
      };
      currency: {
        contract?: string;
        name?: string;
        symbol?: string;
        decimals?: number;
      };
    };
  };
};
export type Token = {
  tokenId: string;
  contract: string;
  name?: string;
  image?: string;
  owner: string;
  kind?: string;
  description?: string;
  market: Market;
  isFlagged: boolean;
  rarityRank?: number;
  rarity?: number;
  collection: Collection;
  lastSell?: {
    value?: number;
  };
};

export type CustomToken = {
  contract?: string;
  order: number;
  token: string;
};

export type CustomCollection = {
  id: string;
  isDraft: boolean;
  title: string;
  setId: string;
  tokens: CustomToken[];
};

export type DraggableToken = {
  type?: "spacer" | "token";
  id: string;
} & Token;
