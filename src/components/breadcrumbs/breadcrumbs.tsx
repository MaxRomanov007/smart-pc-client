import { Breadcrumb } from "@chakra-ui/react";
import type { IBreadcrumb } from "@/@types/ui/navigation/breadcrumb";
import BreadcrumbItem from "@/components/breadcrumbs/breadcrumb-item";
import { Fragment } from "react";

interface Props {
  items: IBreadcrumb[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        {items.map((item, index) => (
          <Fragment key={item.label ?? index}>
            <BreadcrumbItem item={item} />
            {index !== items.length - 1 && <Breadcrumb.Separator />}
          </Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
