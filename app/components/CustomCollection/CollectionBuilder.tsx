import { useGlobalStateUpdater } from "~/context";
import React from "react";
import { useImmer } from "use-immer";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import CollectionSidebar from "./CollectionSidebar";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import CollectionItemsBox from "~/components/CustomCollection/CollectionItemsBox";
import { CollectionItem } from "~/components/CustomCollection/TokenSelect";
import type { DraggableToken } from "~/types/collection";
import TokenCard from "~/components/CustomCollection/TokenCard";
import { Link } from "@remix-run/react";
import { RiAddCircleLine } from "react-icons/ri";

export default function CollectionBuilder({
  tokens = [],
  collectionTitle,
  collectionId,
}: {
  tokens?: DraggableToken[];
  collectionTitle?: string;
  collectionId?: string;
}) {
  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = React.useState(
    Date.now()
  );
  const actions = useGlobalStateUpdater();

  const spacerInsertedRef = React.useRef(false);
  const currentDragTokenRef = React.useRef<DraggableToken | null>(null);
  const [activeSidebarToken, setActiveSidebarToken] =
    React.useState<DraggableToken | null>(null);
  const [activeToken, setActiveToken] = React.useState<DraggableToken | null>();
  const [data, updateData] = useImmer({
    collectionItems: tokens,
  });

  const createSpacer = ({ id }: { id: string }) => {
    return {
      id,
      type: "spacer",
    };
  };

  const handleDeleteToken = (id: string) => {
    updateData((draft) => {
      const index = draft.collectionItems.findIndex((item) => item.id === id);
      draft.collectionItems.splice(index, 1);
    });
  };

  const getData = (prop: { data?: Record<string, any> }) => {
    return prop?.data?.current ?? {};
  };

  const cleanUp = () => {
    setActiveSidebarToken(null);
    setActiveToken(null);
    currentDragTokenRef.current = null;
    spacerInsertedRef.current = false;
  };

  const { collectionItems } = data;

  React.useEffect(() => {
    const saveDraft = () => {
      actions.updateDraftCollection({ items: collectionItems });
    };

    window.addEventListener("beforeunload", saveDraft);

    return () => {
      window.removeEventListener("beforeunload", saveDraft);
    };
  }, []);

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    const activeData = getData(active);

    // This is where the cloning starts.
    // We set up a ref to the field we're dragging
    // from the sidebar so that we can finish the clone
    // in the onDragEnd handler.
    if (activeData.fromSidebar) {
      const { tokenInfo } = activeData;
      const { type, ...token } = tokenInfo;
      setActiveSidebarToken(tokenInfo);
      // Create a new field that'll be added to the fields array
      // if we drag it over the canvas.
      currentDragTokenRef.current = {
        id: active.id,
        type,
        parent: null,
        ...token,
      };
      return;
    }

    // We aren't creating a new element so go ahead and just insert the spacer
    // since this field already belongs to the canvas.
    const { tokenInfo, index } = activeData;
    setActiveToken(tokenInfo);
    currentDragTokenRef.current = tokenInfo;
    const spacer = createSpacer({
      id: String(active.id),
    });
    updateData((draft) => {
      // We can safely cast `spacer` as a DraggableToken because we are never gonna access
      // any of the DraggableToken properties when `type == "spacer"`
      draft.collectionItems.splice(index, 1, spacer as DraggableToken);
    });
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    const activeData = getData(active);

    // Once we detect that a sidebar field is being moved over the canvas
    // we create the spacer using the sidebar fields id and add into the
    // fields array so that it'll be rendered on the canvas.

    // 🐑 CLONING 🐑
    // This is where the clone occurs. We're taking the id that was assigned to
    // sidebar field and reusing it for the spacer that we insert to the canvas.
    if (activeData.fromSidebar && !spacerInsertedRef.current) {
      const overData = getData(over ?? {});

      const spacer = createSpacer({
        id: active.id as string,
      });

      updateData((draft) => {
        if (!draft.collectionItems.length) {
          draft.collectionItems.push(spacer as DraggableToken);
        } else {
          const nextIndex =
            overData.index > -1
              ? overData.index
              : draft.collectionItems.length - 1;
          draft.collectionItems.splice(
            nextIndex + 1,
            0,
            spacer as DraggableToken
          );
        }
        spacerInsertedRef.current = true;
      });
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { over } = e;

    // We dropped outside of the over so clean up so we can start fresh.
    if (!over) {
      cleanUp();
      updateData((draft) => {
        draft.collectionItems = draft.collectionItems.filter(
          (f) => f.type !== "spacer"
        );
      });
      return;
    }

    // This is where we commit the clone.
    // We take the field from the this ref and replace the spacer we inserted.
    // Since the ref just holds a reference to a field that the context is aware of
    // we just swap out the spacer with the referenced field.
    let nextItem = currentDragTokenRef.current;

    if (nextItem) {
      const overData = getData(over);

      updateData((draft) => {
        const spacerIndex = draft.collectionItems.findIndex(
          (f) => f.type === "spacer"
        );
        draft.collectionItems.splice(spacerIndex, 1, nextItem!);

        draft.collectionItems = arrayMove(
          draft.collectionItems,
          spacerIndex,
          overData.index || 0
        );
      });
    }

    setSidebarFieldsRegenKey(Date.now());
    cleanUp();
  };

  const selectedTokens = collectionItems.map((c) => {
    return c?.tokenId ?? c?.id;
  });

  const activationConstraint = {
    delay: 120,
    tolerance: 10,
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint }),
    useSensor(TouchSensor, { activationConstraint })
  );

  return (
    <div className="flex h-full w-full grow flex-col gap-4">
      <div className="mb-4 flex w-full w-full items-center justify-between">
        <h3 className="text-3xl dark:text-white">
          {collectionId ? "Edit Collection" : "Create Collection"}
        </h3>
        {collectionId && (
          <Link
            to={`/collections/new`}
            title="Create Collection"
            className="group flex items-center justify-center gap-2 text-xl hover:underline"
          >
            New
            <span className="rounded-full from-[#622ADB] to-[#CE66ED] p-0.5 text-3xl text-[#CE66ED] group-hover:bg-gradient-to-tr group-hover:text-white ">
              <RiAddCircleLine />
            </span>
          </Link>
        )}
      </div>
      <div className="flex h-full w-full grow gap-4">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          autoScroll
          sensors={sensors}
        >
          <CollectionSidebar
            fieldsRegKey={sidebarFieldsRegenKey}
            selectedTokens={selectedTokens}
          />
          <SortableContext
            strategy={rectSortingStrategy}
            items={selectedTokens}
          >
            <CollectionItemsBox
              onDelete={handleDeleteToken}
              collectionItems={collectionItems}
              collectionTitle={collectionTitle}
              collectionId={collectionId}
            />
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeSidebarToken ? (
              <CollectionItem overlay tokenInfo={activeSidebarToken} />
            ) : null}
            {activeToken ? (
              <TokenCard
                onDelete={handleDeleteToken}
                overlay
                tokenInfo={activeToken}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
