import FormatEth from "~/components/FormatEth";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableToken } from "~/types/collection";
import { RiDeleteBin5Line } from "react-icons/ri";

type TokenCardProps = {
  tokenInfo: DraggableToken;
  overlay?: boolean;
  index?: number;
  onDelete: (id: string) => void;
};

export default function TokenCard({
  tokenInfo,
  overlay,
  index,
  onDelete,
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

  let className = "relative canvas-field flex shadow-md";
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
        <div className="flex h-[298.5px] w-full flex-col rounded-md bg-[#CE66ED] opacity-30"></div>
      ) : (
        <div className="relative flex w-52 flex-col rounded-md bg-[#100E1A]">
          <div className="group relative aspect-square w-full rounded-t">
            <img
              className="aspect-square w-full rounded-t"
              src={tokenInfo?.image}
              alt={tokenInfo?.name}
            />
            <button
              onClick={() => onDelete(tokenInfo.id)}
              className="absolute right-2 top-2 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-600 text-lg shadow-md hover:scale-110 hover:bg-red-700"
            >
              <RiDeleteBin5Line />
            </button>
          </div>
          <div className="flex flex-col justify-between p-2">
            <div className="flex flex-col">
              <span className="w-full truncate text-xs text-slate-300">
                {tokenInfo?.collection?.name}
              </span>
              <span className="w-full truncate text-sm">{tokenInfo?.name}</span>
            </div>
            <div className="mt-2 flex w-full justify-between">
              <div className="flex flex-col text-xs">
                <span className="text-slate-300">Last Price</span>
                <div>
                  <FormatEth
                    maximumFractionDigits={3}
                    amount={tokenInfo?.lastSell?.value}
                  />
                </div>
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-slate-300">Price</span>
                <div>
                  <FormatEth
                    maximumFractionDigits={3}
                    amount={tokenInfo?.market?.floorAsk?.price?.amount?.native}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
