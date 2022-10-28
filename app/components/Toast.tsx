import * as RadixToast from "@radix-ui/react-toast";

export const ToastProvider = RadixToast.Provider;
export const ToastAction = RadixToast.Action;

type ToastProps = {
  title: string;
  open?: boolean;
  setOpen?: () => void;
  children?: React.ReactNode;
  description?: string;
};

export default function CustomToast({
  title,
  open,
  setOpen,
  description,
  children,
}: ToastProps) {
  return (
    <>
      <RadixToast.Root open={open} onOpenChange={setOpen}>
        <RadixToast.Title>{title}</RadixToast.Title>
        {description && (
          <RadixToast.Description>{description}</RadixToast.Description>
        )}
        {children}
        <RadixToast.Close />
      </RadixToast.Root>

      <RadixToast.Viewport />
    </>
  );
}
