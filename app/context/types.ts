import type { Token } from "~/types/collection";

export enum ActionTypes {
  CONNECT_WALLET = "connect_wallet",
  DISCONNECT_WALLET = "disconnect_wallet",
  SET_DRAFT_COLLECTION = "set_draft_collection",
  SET_COLLECTION_ID = "set_collection_id",
  INIT = "init",
}

export type State = {
  connectWallet: {
    open: boolean;
    address: string | null;
  };
  draftCollection: {
    collectionId: string | null;
    title?: string | null;
    items: Token[];
  };
};

export type Actions = {
  type: ActionTypes;
  payload?: unknown;
};

export type ActionCreators = {
  connectWallet: (data: string) => void;
  disconnectWallet: () => void;
  setCollectionId: (id: string) => void;
  updateDraftCollection: (data: { title?: string; items: Token[] }) => void;
  init: (address?: string) => void;
};
