import type { FC } from "react";
import TokenSelect, {
  CollectionItem,
} from "~/components/CustomCollection/TokenSelect";
import CollectionSelect from "~/components/CustomCollection/CollectionSelect";
import React from "react";

type SidebarProps = {
  fieldsRegKey: number;
  selectedTokens: string[];
};

const CollectionSidebar: FC<SidebarProps> = ({
  fieldsRegKey,
  selectedTokens,
}) => {
  const [collectionId, setCollectionId] = React.useState<string | null>(null);
  return (
    <div
      key={fieldsRegKey}
      className="flex w-80 shrink-0 grow flex-col rounded-md bg-gradient-to-tr from-[#622ADB] to-[#CE66ED] p-px"
    >
      <div className="flex w-full grow flex-col gap-6 rounded-md bg-[#100E1A] px-3 pt-8 pb-3 text-white">
        <div className="items-left flex w-full flex-col gap-2">
          <span className="">Select a collection</span>
          <CollectionSelect
            onCollectionChange={(id: string) => setCollectionId(id)}
          />
        </div>
        {collectionId && (
          <div className="items-left flex w-full flex-col gap-2 overflow-x-auto">
            <div className="flex items-baseline gap-2">
              <span className="">Select your tokens</span>
              <span className="text-xs">(min 2 tokens)</span>
            </div>
            <TokenSelect
              selectedTokens={selectedTokens}
              collectionId={collectionId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionSidebar;
export { CollectionItem };
