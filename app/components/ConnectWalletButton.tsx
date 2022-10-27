import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { FC } from "react";
import { useAccount } from "wagmi";

type Props = {
  className?: HTMLButtonElement["className"];
};

const ConnectWalletButton: FC<Props> = ({ className }) => {
  const account = useAccount();
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
                  onClick={openConnectModal}
                  type="button"
                  className={`rounded-md bg-gradient-to-tr from-[#622ADB] to-[#CE66ED] px-6 py-4 text-sm tracking-wider text-white hover:from-green-400 hover:to-blue-500 ${className}`}
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
