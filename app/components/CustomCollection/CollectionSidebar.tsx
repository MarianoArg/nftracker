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
      className="flex w-full shrink-0 grow flex-col rounded-md bg-gradient-to-tr from-neon-purple to-neon-pink p-px lg:w-80"
    >
      <div className="flex w-full grow flex-col gap-3 rounded-md bg-primary-blue px-3 pt-4 pb-3 text-white lg:gap-6 lg:pt-8">
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
