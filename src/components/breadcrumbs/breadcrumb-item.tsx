import type { IBreadcrumb } from "@/@types/ui/navigation/breadcrumb";
import { Breadcrumb } from "@chakra-ui/react";
import BreadcrumbLink from "@/components/breadcrumbs/breadcrumb-link";

interface Props {
  item: IBreadcrumb;
}

export default function BreadcrumbItem({ item }: Props) {
  return item.label ? <BreadcrumbLink item={item} /> : <Breadcrumb.Ellipsis />;
}
