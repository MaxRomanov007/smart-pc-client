import type { Metadata } from "next";
import { getExtracted } from "next-intl/server";

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
  return <div />;
}
