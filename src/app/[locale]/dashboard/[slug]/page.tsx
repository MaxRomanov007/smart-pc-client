import { SlugPcPage } from "@/app/[locale]/dashboard/[slug]/(components)/page/page";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <SlugPcPage slug={slug} />;
}
