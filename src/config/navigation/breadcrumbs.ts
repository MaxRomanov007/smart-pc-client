import { type getExtracted, getTranslations } from "next-intl/server";
import type { IBreadcrumb } from "@/@types/ui/navigation/breadcrumb";

type TType =
  | Awaited<ReturnType<typeof getTranslations>>
  | Awaited<ReturnType<typeof getExtracted>>;

export class BREADCRUMBS {
  static first(t: TType): IBreadcrumb {
    return {
      href: "/first",
      label: t("breadcrumb_item_first_label"),
    };
  }
}
