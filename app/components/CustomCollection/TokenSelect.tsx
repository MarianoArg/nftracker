import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useDraggable } from "@dnd-kit/core";
import type { DraggableToken } from "~/types/collection";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";
import { useTokens } from "@reservoir0x/reservoir-kit-ui";
import { useInView } from "react-intersection-observer";

const mergeRefs = (...refs) => {
  return (node) => {
    for (const ref of refs) {
      if (ref) {
        if (typeof ref === "function") {
          ref(node);
        } else {
          ref.current = node;
        }
      }
    }
  };
};

export default function TokenSelect({
  selectedTokens,
  collectionId,
}: {
  selectedTokens: string[];
  collectionId: string;
}) {
  const { ref, inView } = useInView();
  const {
    data: tokens,
    hasNextPage,
    fetchNextPage,
  } = useTokens({
    collection: collectionId,
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <ScrollArea.Root className="box-border h-[620px] w-[294px] overflow-hidden bg-[#22263c] p-2">
      <ScrollArea.Viewport className="flex h-full w-full">
        <div className="flex w-full flex-col items-center justify-between gap-2 rounded-md">
          {tokens?.map(({ token, market }, index, arr) => (
            <DraggableCollectionToken
              key={token?.tokenId}
              isDisabled={selectedTokens.includes(token?.tokenId)}
              paginationRef={index === arr.length - 5 ? ref : undefined}
              tokenInfo={{ ...token, id: token?.tokenId, market }}
            />
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}

export const CollectionItem = ({
  tokenInfo,
  overlay,
}: {
  overlay?: boolean;
  tokenInfo: DraggableToken;
}) => {
  let className =
    "relative box-border flex w-[278px] items-center cursor-pointer gap-2 truncate rounded bg-[#100E1A] px-3 py-2 text-sm hover:bg-[#100E1A] sidebar-collection";
  if (overlay) {
    className += " overlay";
  }

  return (
    <div className={className}>
      <img
        alt={`${tokenInfo?.name} logo`}
        src={tokenInfo?.image}
        className="h-8 w-8 rounded-full object-cover"
      />
      <span className="truncate">{tokenInfo?.name}</span>
    </div>
  );
};

const DraggableCollectionToken = ({
  paginationRef,
  tokenInfo,
  overlay,
  isDisabled,
}: {
  paginationRef?: (node?: Element | null | undefined) => void;
  tokenInfo: DraggableToken;
  isDisabled: boolean;
  overlay?: boolean;
}) => {
  const id = React.useRef(uuidv4());
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id.current,
      data: {
        tokenInfo,
        fromSidebar: true,
        type: "token",
      },
      disabled: isDisabled,
    });

  let className = `relative box-border flex w-[278px] items-center ${
    isDisabled ? "cursor-default opacity-50" : "cursor-pointer"
  } gap-2 truncate rounded  px-3 py-2 text-sm bg-[#100E1A] hover:bg-[#100E1A] sidebar-collection`;
  if (overlay) {
    className += " overlay";
  }

  const style = {
    transform: CSS.Transform.toString({
      x: transform?.x ?? 0,
      y: transform?.y ?? 0,
      scaleX: isDragging ? 1.03 : 1,
      scaleY: isDragging ? 1.03 : 1,
    }),
  };

  return (
    <div
      style={style}
      {...listeners}
      {...attributes}
      className={className}
      ref={mergeRefs(paginationRef, setNodeRef)}
    >
      <img
        alt={`${tokenInfo?.name} logo`}
        src={tokenInfo?.image}
        className="h-8 w-8 rounded-full object-cover"
      />
      <span className="truncate">{tokenInfo?.name}</span>
    </div>
  );
};
