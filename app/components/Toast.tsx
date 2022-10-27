import * as RadixToast from "@radix-ui/react-toast";

export const ToastProvider = RadixToast.Provider;
export const ToastAction = RadixToast.Action;

export default function CustomToast({
  title,
  open,
  setOpen,
  description,
  children,
}) {
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
