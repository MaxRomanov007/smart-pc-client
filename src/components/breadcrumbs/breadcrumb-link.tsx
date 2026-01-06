import type { IBreadcrumb } from "@/@types/ui/navigation/breadcrumb";
import { Breadcrumb } from "@chakra-ui/react";
import { Link } from "@/i18n/navigation";

interface Props {
  item: IBreadcrumb;
}

export default function BreadcrumbLink({ item }: Props) {
  return (
    <Breadcrumb.Item>
      {item.href ? (
        <Breadcrumb.Link asChild>
          <Link href={item.href}>{item.label}</Link>
        </Breadcrumb.Link>
      ) : (
        <Breadcrumb.CurrentLink>{item.label}</Breadcrumb.CurrentLink>
      )}
    </Breadcrumb.Item>
  );
}
