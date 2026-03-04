import type { Metadata } from "next";
import { getExtracted } from "next-intl/server";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { getStandardBreadcrumbs } from "@/utils/hooks/ui/breadcrumbs/server";
import { Parameter } from "@/components/command/parameter/parameters/parameter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getExtracted("index-page-metadata");

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

      <Parameter
        parameter={{
          name: "hello",
          description: "this is Hello",
          type: 1,
          id: "hello",
          value: true,
        }}
      />

      <Parameter
        parameter={{
          name: "hello",
          description: "this is Hello",
          type: 2,
          id: "hello",
          value: 2,
        }}
      />

      <Parameter
        parameter={{
          name: "hello",
          description: "this is Hello",
          type: 3,
          id: "hello",
          value: "hello",
        }}
      />
    </>
  );
}
