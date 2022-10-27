import * as AlertDialog from "@radix-ui/react-alert-dialog";

type DialogProps = {
  title: string;
  description?: string;
  cancelText?: string;
  confirmText: string;
  children: React.ReactNode;
  open?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Dialog({
  title,
  description,
  cancelText,
  confirmText,
  children,
  open,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[9999] bg-[#100E1A]/80" />
        <AlertDialog.Content className="fixed top-2/4 left-2/4 z-[99991] flex -translate-y-1/2 -translate-x-1/2 flex-col gap-4 rounded-md bg-[#22263c] p-5 tracking-wider shadow-md	">
          {title && (
            <AlertDialog.Title className="mb-2 text-slate-100">
              {title}
            </AlertDialog.Title>
          )}
          {description && (
            <AlertDialog.Description className="font-sans text-sm text-slate-300">
              {description}
            </AlertDialog.Description>
          )}
          <div className="flex justify-end gap-4 pt-2 text-sm tracking-wider">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onCancel}
                className="rounded-md border border-slate-300 bg-[#22263c]/10 px-3 py-2 tracking-wider text-slate-200 outline-none hover:bg-slate-600"
              >
                {cancelText ?? "Cancel"}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className="rounded-md border border-transparent bg-red-100 px-3 py-2 tracking-wider text-red-600 outline-none hover:border-red-700 hover:bg-red-200"
              >
                {confirmText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
