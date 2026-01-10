import type { Metadata } from "next";
import { getExtracted } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { getStandardBreadcrumbs } from "@/utils/ui/breadcrumbs/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getExtracted();

  return {
    title: t({
      message: "Index page",
      description: "title of index page in metadata",
    }),
  };
}

export default async function MainPage() {
  const breadcrumbs = await getStandardBreadcrumbs();

  return (
    <>
      <Breadcrumbs
        items={[
          breadcrumbs.dashboard,
          {
            label: "Title",
            href: "/",
          },
          {},
          {
            label: "Current",
          },
        ]}
      />
    </>
  );
}
