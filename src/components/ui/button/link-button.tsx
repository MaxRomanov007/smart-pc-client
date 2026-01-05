import { Button } from "@chakra-ui/react";
import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Button> {
  href: string;
}

export default function LinkButton({ href, children, ...props }: Props) {
  return (
    <Button {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
