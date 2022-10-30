import { Form, Link, useSubmit } from "@remix-run/react";
import { useTokens } from "@reservoir0x/reservoir-kit-ui";
import type { CustomCollection } from "~/types/collection";
import CollectionPlaceholder from "~/images/collection-placeholder.webp";
import { RiDeleteBin5Line, RiEdit2Fill } from "react-icons/ri";
import Dialog from "~/components/AlertDialog";
import React from "react";

type CollectionCardProps = {
  collection: CustomCollection;
};

export default function CollectionCard({ collection }: CollectionCardProps) {
  const { data: tokens } = useTokens({
    tokens: collection.tokens.map((t) => `${t?.contract}:${t?.token}`),
  });
  const formRef = React.useRef<HTMLFormElement>(null);
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const collectionImage = tokens?.find((c) => c?.token?.image)?.token?.image;
  const submit = useSubmit();

  const confirmDelete = () => {
    const form = formRef.current;
    if (form) {
      const formData = new FormData(form);
      submit(formData, {
        method: "post",
        action: form.getAttribute("action") ?? form.action,
      });
    }
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setShowDialog(true);
  };

  return tokens.length ? (
    <div className="group relative flex h-32 w-full cursor-pointer justify-between overflow-hidden rounded-md bg-secondary-blue p-4 shadow-lg">
      <Link
        to={`/collections/${collection.id}`}
        className="absolute inset-0 opacity-30"
      >
        <img
          className="h-full w-full object-cover"
          src={collectionImage ?? CollectionPlaceholder}
          alt={`${collection.title}`}
        />
        <div className="absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-saturation" />
      </Link>
      <div className="relative flex h-full flex-col justify-between">
        <span className="text-xl text-white underline">{collection.title}</span>
        <span>{`#${tokens.length} items`}</span>
      </div>

      <div className="relative z-50 flex h-full w-12 flex-col items-center justify-center gap-6">
        <Form method="post" onSubmit={handleDelete} ref={formRef}>
          <input type="hidden" value={collection.id} name="collectionId" />
          <Dialog
            title="Do you want to delete this collection?"
            confirmText="Yes, delete it"
            open={showDialog}
            onCancel={() => setShowDialog(false)}
            onConfirm={confirmDelete}
            description="This action cannot be undone. This will permanently delete this collection."
          >
            <button
              type="submit"
              className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-600 text-lg shadow-md hover:scale-110 hover:bg-red-700"
            >
              <RiDeleteBin5Line />
            </button>
          </Dialog>
        </Form>
        <Link
          to={`/collections/${collection.id}/edit`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-pink text-lg tracking-wider text-white transition-all delay-100 ease-in-out hover:scale-110 hover:bg-light-purple hover:ring-green-400"
        >
          <RiEdit2Fill />
        </Link>
      </div>
    </div>
  ) : (
    <div className="h-32 w-full animate-pulse overflow-hidden rounded-md bg-secondary-blue">
      <div className="relative flex h-full w-full flex-col justify-between p-4">
        <span className="h-8 w-5/12 rounded-md bg-[#464b65]"></span>
        <span className="h-7 w-3/12 rounded-md bg-[#464b65]"></span>
      </div>
    </div>
  );
}
