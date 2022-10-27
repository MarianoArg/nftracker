import type { State, Actions } from "./types";
import { ActionTypes } from "./types";
import { setAddressData, getAddressData } from "./storage";
import type { Token } from "~/types/collection";

export default function GlobalStateReducer(state: State, action: Actions) {
  switch (action.type) {
    case ActionTypes.CONNECT_WALLET:
      setAddressData(action.payload as string, {
        ...state,
        connectWallet: {
          open: false,
          address: action.payload as string | null,
        },
        draftCollection: {
          collectionId: null,
          items: [],
        },
      });

      return {
        ...state,
        connectWallet: {
          open: true,
          address: action.payload as string | null,
        },
        draftCollection: {
          collectionId: null,
          items: [],
        },
      };
    case ActionTypes.DISCONNECT_WALLET: {
      setAddressData(state.connectWallet.address as string, {
        ...state,
        connectWallet: { open: false, address: null },
        draftCollection: {
          collectionId: null,
          items: [],
        },
      });
      return {
        ...state,
        connectWallet: { open: false, address: null },
        draftCollection: {
          collectionId: null,
          items: [],
        },
      };
    }
    case ActionTypes.SET_DRAFT_COLLECTION: {
      if (state.connectWallet.address) {
        setAddressData(state.connectWallet.address, {
          ...state,
          draftCollection: {
            ...state.draftCollection,
            title: action.payload.title as string,
            items: action.payload.items as Token[],
          },
        });
      }

      return {
        ...state,
        draftCollection: {
          ...state.draftCollection,
          title: action.payload.title as string,
          items: action.payload.items as Token[],
        },
      };
    }
    case ActionTypes.INIT: {
      const data = getAddressData(action.payload as string);

      if (data) {
        return {
          ...data,
        };
      }
      return {
        ...state,
      };
    }
    case ActionTypes.SET_COLLECTION_ID: {
      if (state.connectWallet.address) {
        setAddressData(state.connectWallet.address, {
          ...state,
          draftCollection: {
            ...state.draftCollection,
            collectionId: action.payload as string,
          },
        });
      }

      return {
        ...state,
        draftCollection: {
          ...state.draftCollection,
          collectionId: action.payload as string,
        },
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
