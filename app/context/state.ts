import type { State } from "./types";

const state: State = {
  connectWallet: {
    open: false,
    address: null,
  },
  draftCollection: {
    collectionId: null,
    title: null,
    items: [],
  },
};

export default state;
