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
    event.preventDefault();
    setShowDialog(true);
  };

  return tokens.length ? (
    <div className="group relative flex h-32 w-full cursor-pointer justify-between overflow-hidden rounded-md bg-[#22263c] p-4">
      <div className="absolute inset-0 opacity-30">
        <img
          className="h-full w-full object-cover"
          src={collectionImage ?? CollectionPlaceholder}
          alt={`${collection.title}`}
        />
        <div className="absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-saturation" />
      </div>
      <div className="relative flex h-full flex-col justify-between">
        <span className="text-xl text-white underline">{collection.title}</span>
        <span>{`#${tokens.length} items`}</span>
      </div>
      <div className="delay-10 absolute inset-0 h-0 w-full overflow-hidden bg-slate-900/70 transition-all ease-in-out group-hover:h-full">
        <div className="relative flex h-full w-full items-center items-center justify-center gap-6">
          <Link
            to={`/collections/${collection.id}`}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#622ADB] to-[#CE66ED] text-lg tracking-wider text-white transition-all delay-100 ease-in-out hover:scale-125 hover:bg-transparent hover:text-2xl hover:ring-green-400"
          >
            <RiEdit2Fill />
          </Link>
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
                className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/50 text-base tracking-wider text-white/70 outline-none ring-1 ring-inset ring-[#CE66ED] transition-all delay-100 ease-in-out hover:scale-125 hover:bg-transparent hover:text-xl hover:text-white hover:ring-green-400"
              >
                <RiDeleteBin5Line />
              </button>
            </Dialog>
          </Form>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-32 w-full animate-pulse overflow-hidden rounded-md bg-[#22263c]">
      <div className="relative flex h-full w-full flex-col justify-between p-4">
        <span className="h-8 w-5/12 rounded-md bg-[#464b65]"></span>
        <span className="h-7 w-3/12 rounded-md bg-[#464b65]"></span>
      </div>
    </div>
  );
}
