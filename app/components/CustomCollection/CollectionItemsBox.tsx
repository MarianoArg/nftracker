import { Form, useSubmit, useTransition } from "@remix-run/react";
import { useDroppable } from "@dnd-kit/core";
import TokenCard from "~/components/CustomCollection/TokenCard";
import type { DraggableToken } from "~/types/collection";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import React from "react";

type BoxProps = {
  collectionItems: DraggableToken[];
  collectionTitle?: string;
  collectionId?: string;
  onDelete: (id: string) => void;
};

export default function CollectionItemsBox({
  collectionItems,
  collectionId,
  collectionTitle,
  onDelete,
}: BoxProps) {
  const transition = useTransition();
  const submit = useSubmit();
  const [title, setTitle] = React.useState<string>(collectionTitle ?? "");
  console.log("transition state", transition);
  const { setNodeRef } = useDroppable({
    id: "collection-board-droppable",
    data: {
      parent: null,
      isContainer: true,
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const items = collectionItems.map((c, i) => ({
      token: c?.tokenId,
      contract: c?.contract,
      order: i,
    }));
    const formData = new FormData(form);
    formData.set("items", JSON.stringify(items));
    submit(formData, {
      method: form.getAttribute("method") ?? form.method,
      action: form.getAttribute("action") ?? form.action,
    });
  };

  const buttonText = collectionId ? "Update" : "Create";

  return (
    <div className="flex w-full grow flex-col rounded-md bg-gradient-to-tr from-[#622ADB] to-[#CE66ED] p-px">
      <div className="flex grow flex-col rounded-md bg-[#100E1A] px-3 pt-8 pb-3">
        <div className="flex w-full">
          <Form
            className="flex w-full justify-between gap-2"
            onSubmit={handleSubmit}
            method="post"
            action={
              collectionId ? `/collections/${collectionId}` : "/collections/new"
            }
          >
            <input
              required
              className="w-full rounded p-2 text-black"
              placeholder="Collection Name..."
              name="collection_name"
              type="text"
              value={title}
              onChange={(e) => {
                const { target } = e;
                setTitle(target.value);
              }}
            />
            <input type="hidden" name="id" value={collectionId} />
            <button
              className="shrink-0 rounded bg-gradient-to-r from-[#53B5BC] to-[#1F49C2] px-6 py-2 disabled:opacity-50"
              type="submit"
              disabled={
                collectionItems.length < 2 ||
                !title ||
                transition.state === "submitting"
              }
            >
              {transition.state === "submitting"
                ? "Saving Collection"
                : buttonText}
            </button>
          </Form>
        </div>
        <ScrollArea.Root
          className="mt-4 box-border h-[700px] w-full overflow-hidden rounded bg-[#22263c] p-2"
          ref={setNodeRef}
        >
          <ScrollArea.Viewport className="flex h-full w-full">
            <div className="grid grid-cols-3 items-start gap-2">
              {collectionItems?.map((item, index) => (
                <TokenCard
                  key={item?.id}
                  tokenInfo={item}
                  index={index}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </div>
    </div>
  );
}
