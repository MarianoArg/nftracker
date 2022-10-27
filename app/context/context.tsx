import React from "react";
import globalStateReducer from "./reducer";
import InitialState from "./state";
import type { State, ActionCreators } from "./types";
import {
  connectWallet,
  disconnectWallet,
  updateDraftCollection,
  setCollectionId,
  init,
} from "./actions";
import type { Token } from "~/types/collection";
import { useImmerReducer } from "use-immer";
import { useAccount } from "wagmi";

const GlobalStateContext = React.createContext<State>(InitialState);
const GlobalUpdaterContext = React.createContext<Omit<ActionCreators, "init">>({
  connectWallet: () => {},
  disconnectWallet: () => {},
  updateDraftCollection: () => {},
  setCollectionId: () => {},
});

interface ProviderProps {
  children: React.ReactNode;
}

export default function GlobalStateProvider({ children }: ProviderProps) {
  const [state, dispatch] = useImmerReducer(globalStateReducer, InitialState);
  const account = useAccount();

  React.useEffect(() => {
    dispatch(init(account.address));
  }, []);

  const actions = React.useMemo(
    () => ({
      connectWallet: (data: string) => dispatch(connectWallet(data)),
      disconnectWallet: () => dispatch(disconnectWallet()),
      setCollectionId: (id: string) => dispatch(setCollectionId(id)),
      updateDraftCollection: (data: { title?: string; items: Token[] }) =>
        dispatch(updateDraftCollection(data)),
    }),
    []
  );

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalUpdaterContext.Provider value={actions}>
        {children}
      </GlobalUpdaterContext.Provider>
    </GlobalStateContext.Provider>
  );
}

function useGlobalState() {
  const state = React.useContext(GlobalStateContext);
  if (typeof state === "undefined") {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return state;
}

function useGlobalStateUpdater() {
  const actions = React.useContext(GlobalUpdaterContext);
  if (typeof actions === "undefined") {
    throw new Error(
      "useGlobalStateUpdater must be used within a GlobalStateProvider"
    );
  }

  return actions;
}

export { GlobalStateProvider, useGlobalState, useGlobalStateUpdater };
