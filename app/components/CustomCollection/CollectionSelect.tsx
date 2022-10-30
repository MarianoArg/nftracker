import usePaginatedCollections from "~/hooks/usePaginatedCollections";
import * as Select from "@radix-ui/react-select";
import { RiArrowDownSLine } from "react-icons/ri";
import type { Collection } from "~/types/collection";
import React from "react";
import { useGlobalState, useGlobalStateUpdater } from "~/context";

type SelectProps = {
  onCollectionChange: (id: string) => void;
};

export default function CollectionSelect({ onCollectionChange }: SelectProps) {
  const { collections, ref } = usePaginatedCollections();
  const { setCollectionId } = useGlobalStateUpdater();
  const { draftCollection } = useGlobalState();
  const { data } = collections;
  const mappedCollections = data
    ? data.flatMap(({ collections }) => collections).filter(Boolean)
    : [];
  const [selectedCollection, setSelectedCollection] =
    React.useState<Collection | null>(
      (mappedCollections as Collection[])?.find(
        (c) => c?.id === draftCollection.collectionId
      ) ?? null
    );

  const handleChange = (id: string) => {
    const selected = mappedCollections.find((c) => c?.id === id);
    setSelectedCollection(selected as Collection);
    setCollectionId(id);
    onCollectionChange(id);
  };

  return (
    <div className="w-full rounded-md bg-secondary-blue p-2 text-white">
      <Select.Root
        onValueChange={handleChange}
        disabled={mappedCollections.length === 0}
        value={draftCollection.collectionId ?? undefined}
      >
        <Select.Trigger asChild>
          <button className="relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-md bg-primary-blue px-3 py-2 outline-none disabled:bg-slate-800 disabled:text-white/70">
            {selectedCollection?.image && (
              <img
                alt={`${selectedCollection?.name} logo`}
                src={selectedCollection?.image}
                className="h-6 w-6 rounded-full object-cover"
              />
            )}
            <Select.Value asChild>
              <span className="w-full truncate text-left">
                {selectedCollection?.name ?? "Select a collection"}
              </span>
            </Select.Value>
            <Select.Icon>
              <RiArrowDownSLine />
            </Select.Icon>
          </button>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content asChild>
            <div className="relative z-40 w-full bg-secondary-blue p-2 lg:max-w-[300px]">
              <Select.ScrollUpButton />
              <Select.Viewport className="flex w-full flex-col gap-2">
                {mappedCollections?.map((collection, index, arr) => (
                  <Select.Item
                    key={collection?.id}
                    value={collection?.id as string}
                    asChild
                  >
                    <div
                      ref={index === arr.length - 5 ? ref : undefined}
                      className="flex w-full shrink-0 grow cursor-pointer items-center gap-2 truncate rounded bg-primary-blue px-3 py-2 text-sm text-white hover:border-0	hover:bg-[#1a1a2a] hover:outline-none lg:max-w-[300px]"
                    >
                      <img
                        alt={`${collection?.name} logo`}
                        src={collection?.image}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <Select.ItemText>{collection?.name}</Select.ItemText>
                      <Select.ItemIndicator />
                    </div>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton />
            </div>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
