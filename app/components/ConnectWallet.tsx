import type { FC } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import EthAccount from "./EthAccount";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useSubmit } from "@remix-run/react";
import { HiOutlineLogout } from "react-icons/hi";
import FormatEth from "./FormatEth";
import ConnectWalletButton from "./ConnectWalletButton";
import React from "react";
import { useGlobalStateUpdater } from "~/context";

const ConnectWallet: FC = () => {
  const account = useAccount();
  const fetcher = useSubmit();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address });
  const { data: ensName } = useEnsName({ address: account?.address });
  const actions = useGlobalStateUpdater();
  const { connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const wallet = connectors[0];

  React.useEffect(() => {
    if (account.isConnected) {
      actions.connectWallet(account.address as string);
    }
  }, [account.isConnected, account.address]);

  if (account.isConnecting) return null;

  if (!account.isConnected) return <ConnectWalletButton />;

  const handleDisconnect = () => {
    disconnect();
    actions.disconnectWallet();
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        name="wallet-address"
        className="btn-primary-outline dark:ring-primary-900 ml-auto rounded-full border-transparent bg-gray-100 px-2 py-2 normal-case dark:border-neutral-600 dark:bg-[#22263c] dark:focus:ring-4"
      >
        <EthAccount
          address={account.address}
          ens={{
            avatar: ensAvatar,
            name: ensName,
          }}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" sideOffset={6}>
        <div className="radix-side-bottom:animate-slide-down flex w-48 flex-col space-y-1 rounded border border-[#CE66ED] bg-white px-1.5 py-2 text-white shadow-md dark:bg-[#22263c] md:w-56">
          <div className="group flex w-full items-center justify-between rounded px-4 py-3 outline-none transition">
            <span>Balance </span>
            <span>
              {account.address && <Balance address={account.address} />}
            </span>
          </div>
          <DropdownMenu.Item asChild>
            <Link
              className="group flex w-full cursor-pointer items-center justify-between rounded px-4 py-3 outline-none transition hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              to={`/address/${account.address}`}
            >
              Portfolio
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              key={wallet.id}
              onClick={handleDisconnect}
              className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded px-4 py-3 outline-none transition hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              <span>Disconnect</span>
              <HiOutlineLogout className="h-6 w-7" />
            </button>
          </DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ConnectWallet;

type Props = {
  address: string;
};

export const Balance: FC<Props> = ({ address }) => {
  const { data: balance } = useBalance({ addressOrName: address });
  return <FormatEth amount={balance?.value} />;
};
