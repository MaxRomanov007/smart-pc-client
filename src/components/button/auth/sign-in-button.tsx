"use client";

import { useExtracted } from "next-intl";
import {
  type ComponentProps,
  type MouseEventHandler,
  type ReactNode,
  useState,
} from "react";
import { Button, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { LuLogIn } from "react-icons/lu";
import { Tooltip } from "@/components/ui/chakra/tooltip";
import { signIn } from "next-auth/react";
import { ROMANOV_DIGITAL_PROVIDER_ID } from "@/auth";

type Props = Omit<
  ComponentProps<typeof Button>,
  "onClick" | "loading" | "children"
>;

export default function SignInButton({
  size,
  variant,
  rounded,
  ...props
}: Props) {
  const t = useExtracted("sign-in-button");
  const [loading, setLoading] = useState(false);
  const isCollapsed = useBreakpointValue([true, null, false]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true);
    await signIn(ROMANOV_DIGITAL_PROVIDER_ID);
    setLoading(false);
  };

  if (isCollapsed) {
    return (
      <SignInButtonTooltip>
        <IconButton
          onClick={handleClick}
          loading={loading}
          size={size ?? ["sm", null, "md"]}
          variant={variant ?? "ghost"}
          rounded={rounded ?? "full"}
          {...props}
        >
          <LuLogIn />
        </IconButton>
      </SignInButtonTooltip>
    );
  }

  return (
    <SignInButtonTooltip>
      <Button
        onClick={handleClick}
        loading={loading}
        size={size ?? ["sm", null, "md"]}
        px={[0, null, 4]}
        variant={variant ?? "ghost"}
        rounded={rounded ?? "full"}
        {...props}
      >
        {t({
          message: "Sign In",
          description: "sign in button text",
        })}
      </Button>
    </SignInButtonTooltip>
  );
}

const SignInButtonTooltip = ({ children }: { children: ReactNode }) => {
  const t = useExtracted("sign-in-button-tooltip");

  return (
    <Tooltip
      content={t({
        message: "Sign In",
        description: "sign in button tooltip",
      })}
    >
      {children}
    </Tooltip>
  );
};
