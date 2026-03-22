import { toaster } from "@/components/ui/chakra/toaster";

function showErrorToast(title: string, description?: string) {
  queueMicrotask(() =>
    toaster.error({
      title,
      description,
    }),
  );
}

export function handleError(title: string, message?: string): never {
  showErrorToast(title, message);
  throw new Error(title);
}

export function showError(title: string, message?: string) {
  showErrorToast(title, message);
}
