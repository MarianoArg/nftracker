import type { Token } from "~/types/collection";
import { ActionTypes } from "./types";

// Action creators
export function connectWallet(data: string) {
  return {
    type: ActionTypes.CONNECT_WALLET,
    payload: data,
  };
}

export function disconnectWallet() {
  return {
    type: ActionTypes.DISCONNECT_WALLET,
  };
}

export function updateDraftCollection(data: {
  title?: string;
  items: Token[];
}) {
  return {
    type: ActionTypes.SET_DRAFT_COLLECTION,
    payload: data,
  };
}

export function setCollectionId(id: string) {
  return {
    type: ActionTypes.SET_COLLECTION_ID,
    payload: id,
  };
}

export function init(address?: string) {
  return {
    type: ActionTypes.INIT,
    payload: address,
  };
}
