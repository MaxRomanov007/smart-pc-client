import type { Metadata } from "next";
import { getExtracted } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { BREADCRUMBS } from "@/config/navigation/breadcrumbs";

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
  const t = await getExtracted();

  return (
    <>
      <Breadcrumbs
        items={[
          BREADCRUMBS.first(t),
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
