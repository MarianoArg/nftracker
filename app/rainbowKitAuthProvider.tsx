import { SiweMessage } from "siwe";

import type { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import type { ReactNode } from "react";
import React from "react";

export type UnconfigurableMessageOptions = {
  address: string;
  chainId: number;
  nonce: string;
};

export type ConfigurableMessageOptions = Partial<
  Omit<SiweMessage, keyof UnconfigurableMessageOptions>
> & {
  [Key in keyof UnconfigurableMessageOptions]?: never;
};

interface RainbowKitSiweNextAuthProviderProps {
  enabled?: boolean;
  children: ReactNode;
  status: AuthenticationStatus;
}

export function RainbowKitAuthProvider({
  children,
  enabled = true,
  status,
}: RainbowKitSiweNextAuthProviderProps) {
  const [sessionStatus, setSessionStatus] =
    React.useState<AuthenticationStatus>(status ?? "loading");
  const adapter = React.useMemo(
    () =>
      createAuthenticationAdapter({
        getNonce: async () => {
          const response = await fetch("/api/nonce");
          return await response.text();
        },

        createMessage: ({ nonce, address, chainId }) => {
          const defaultConfigurableOptions: ConfigurableMessageOptions = {
            domain: window.location.host,
            statement: "Sign in with Ethereum to the app.",
            uri: window.location.origin,
            version: "1",
          };

          const unconfigurableOptions: UnconfigurableMessageOptions = {
            address,
            chainId,
            nonce,
          };

          return new SiweMessage({
            ...defaultConfigurableOptions,
            ...unconfigurableOptions,
          });
        },

        getMessageBody: ({ message }) => {
          return message.prepareMessage();
        },

        verify: async ({ message, signature }) => {
          const verifyRes = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, signature }),
          });

          if (verifyRes?.ok) {
            setSessionStatus("authenticated");
          } else {
            setSessionStatus("unauthenticated");
          }

          return verifyRes?.ok ?? false;
        },

        signOut: async () => {
          await fetch("/api/logout", { method: "POST" });
        },
      }),
    []
  );

  return (
    <RainbowKitAuthenticationProvider adapter={adapter} status={sessionStatus}>
      {children}
    </RainbowKitAuthenticationProvider>
  );
}
