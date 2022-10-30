import { useTokens } from "@reservoir0x/reservoir-kit-ui";
import * as Dialog from "@radix-ui/react-dialog";
import type { Token } from "~/types/collection";
import { RiCloseLine } from "react-icons/ri";

type TokenDetailProps = {
  token: Token;
  children: React.ReactNode;
};

export function TokenDetailCard({ token }: { token: Token }) {
  return (
    <div className="flex w-full flex-col items-start gap-4 p-3">
      {token?.image && (
        <img
          src={token?.image}
          alt={token.name}
          className="aspect-square rounded-md shadow-md"
        />
      )}
      <div className="flex w-full flex-col items-start">
        {token?.collection?.name && (
          <span className="text-sm text-blue-700">{`${token?.collection?.name} Collection`}</span>
        )}
        <h3 className="text-2xl">{token?.name}</h3>
        {token?.description && (
          <p className="font-sans text-sm">{token.description}</p>
        )}
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        <h4>Details</h4>
        <div className="col-span-2 flex w-full flex-col font-sans text-xs font-medium text-slate-600">
          Contract address
          <span className="truncate font-normal text-slate-500">
            {token.contract}
          </span>
        </div>
        <div className="col-span-1 flex flex-col font-sans text-xs font-medium text-slate-600">
          Chain
          <span className="font-normal text-slate-500">Etherum</span>
        </div>
        <div className="col-span-1 flex flex-col font-sans text-xs font-medium text-slate-600">
          Token ID
          <span className="font-normal text-slate-500">{token?.tokenId}</span>
        </div>
        <div className="col-span-1 flex flex-col font-sans text-xs font-medium text-slate-600">
          Token standard
          <span className="font-normal text-slate-500">{token?.kind}</span>
        </div>
        <div className="col-span-2 flex flex-col font-sans text-xs font-medium text-slate-600">
          Owner
          <span className="truncate font-normal text-slate-500">
            {token?.owner}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TokenDetail({ token, children }: TokenDetailProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex text-left">{children}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9999] bg-primary-blue/80" />
        <Dialog.Content asChild>
          <div className="fixed top-2/4 left-2/4 z-[99991] flex max-h-[100%] w-full max-w-[380px] -translate-y-1/2 -translate-x-1/2 flex-col overflow-y-auto overscroll-contain rounded-md bg-white p-2 tracking-wider shadow-md">
            <Dialog.Close asChild>
              <button className="absolute top-1.5 right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xl hover:bg-light-purple/30">
                <RiCloseLine />
              </button>
            </Dialog.Close>
            <TokenDetailCard token={token} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
