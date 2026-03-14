import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export default function useKeyboardNavigation(
  path: string = "/",
  key: string = "Escape",
) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        router.push(path);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, path, key]);
}
