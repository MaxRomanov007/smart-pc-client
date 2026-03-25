import { Breadcrumb } from "@chakra-ui/react";
import type { IBreadcrumb } from "@/types/ui/navigation/breadcrumb";
import BreadcrumbItem from "@/components/breadcrumbs/breadcrumb-item";
import { type ComponentProps, Fragment } from "react";

interface Props extends ComponentProps<typeof Breadcrumb.Root> {
  items: IBreadcrumb[];
}

export default function Breadcrumbs({ items, ...rest }: Props) {
  return (
    <Breadcrumb.Root {...rest}>
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
