import { Breadcrumb } from "@chakra-ui/react";
import type { IBreadcrumb } from "@/@types/ui/navigation/breadcrumb";
import BreadcrumbItem from "@/components/breadcrumbs/breadcrumb-item";

interface Props {
  items: IBreadcrumb[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        {items.map((item, index) => (
          <>
            <BreadcrumbItem key={item.label ?? index} item={item} />
            {index !== items.length - 1 && <Breadcrumb.Separator />}
          </>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
