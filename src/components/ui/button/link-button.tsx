import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Button> {
  href: string;
}

export default function LinkButton({
  href,
  children,
  disabled,
  ...props
}: Props) {
  if (disabled) {
    return (
      <Button disabled={disabled} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <Button asChild {...props}>
      <Link href={href}>
        <HStack>{children}</HStack>
      </Link>
    </Button>
  );
}
