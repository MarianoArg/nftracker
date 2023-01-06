import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { FC } from "react";
import { useAccount } from "wagmi";

import * as gtag from "~/gtags.client";

type Props = {
  className?: HTMLButtonElement["className"];
};

const ConnectWalletButton: FC<Props> = ({ className }) => {
  const account = useAccount();
  const trackConnectEvent = () => {
    gtag.event({
      action: "connected_wallet",
      category: "Wallet",
    });
  };
  return (
    <ConnectButton.Custom>
      {({ openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== "loading";

        return (
          <div
            {...((!ready || account.isConnected) && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
                display: "none",
              },
            })}
          >
            {(() => {
              return (
                <button
                  onClick={() => {
                    openConnectModal();
                    trackConnectEvent();
                  }}
                  type="button"
                  className={`rounded-md bg-gradient-to-tr from-neon-purple to-neon-pink px-6 py-4 text-sm tracking-wider text-white hover:from-green-400 hover:to-blue-500 ${className}`}
                >
                  Connect Wallet
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
