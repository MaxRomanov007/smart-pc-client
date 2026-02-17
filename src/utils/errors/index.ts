import { toaster } from "@/components/ui/chakra/toaster";

export function handleError(title: string, message?: string) {
  queueMicrotask(() =>
    toaster.error({
      title: title,
      description: message,
    }),
  );
  throw new Error(title);
}
