import FormatEth from "~/components/FormatEth";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableToken, Token } from "~/types/collection";
import { RiDeleteBin5Line } from "react-icons/ri";

type TokenCardProps = {
  tokenInfo: DraggableToken;
  overlay?: boolean;
  index?: number;
  onDelete?: (id: string) => void;
  mode: "view" | "edit";
};

function isDraggableToken(
  token: Token | DraggableToken
): token is DraggableToken {
  return (token as DraggableToken).id !== undefined;
}

function BaseTokenCard({
  token,
  onDelete,
}: {
  token: DraggableToken | Token;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="relative flex w-52 flex-col rounded-md bg-primary-blue shadow-md">
      <div className="group relative aspect-square w-full rounded-t">
        <img
          className="aspect-square w-full rounded-t"
          src={token?.image}
          alt={token?.name}
        />
        {onDelete && (
          <button
            onClick={() =>
              onDelete(isDraggableToken(token) ? token?.id : token?.tokenId)
            }
            className="absolute right-2 top-2 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-600 text-lg shadow-md hover:scale-110 hover:bg-red-700"
          >
            <RiDeleteBin5Line />
          </button>
        )}
      </div>

      <div className="flex flex-col justify-between p-2">
        <div className="flex flex-col">
          <span className="w-full truncate text-xs text-slate-300">
            {token?.collection?.name}
          </span>
          <span className="w-full truncate text-sm">{token?.name}</span>
        </div>
        <div className="mt-2 flex w-full justify-between">
          <div className="flex flex-col text-xs">
            <span className="text-slate-300">Last Price</span>
            <div>
              <FormatEth
                maximumFractionDigits={3}
                amount={token?.lastSell?.value}
              />
            </div>
          </div>
          <div className="flex flex-col text-xs">
            <span className="text-slate-300">Price</span>
            <div>
              <FormatEth
                maximumFractionDigits={3}
                amount={token?.market?.floorAsk?.price?.amount?.native}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TokenCard({
  tokenInfo,
  overlay,
  index,
  onDelete,
  mode,
}: TokenCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: tokenInfo?.id,
      data: {
        index,
        id: tokenInfo?.id,
        tokenInfo,
      },
    });

  let className = "relative canvas-field flex justify-center items-center w-52";
  if (overlay) {
    className += " overlay";
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={className}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {tokenInfo.type === "spacer" ? (
        <div className="flex h-[298.5px] w-52 flex-col rounded-md bg-neon-pink opacity-30"></div>
      ) : (
        <BaseTokenCard
          token={tokenInfo}
          onDelete={mode === "edit" ? onDelete : undefined}
        />
      )}
    </div>
  );
}
