import { Avatar, Button, HStack, Text } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import type { Session } from "next-auth";

interface Props extends Omit<ComponentProps<typeof Button>, "children"> {
  session: Session;
  avatarProps?: ComponentProps<typeof Avatar.Root>;
}

export default function ProfileButton({
  size,
  variant,
  rounded,
  session,
  avatarProps,
  ...props
}: Props) {
  const name = [session.user.name.first, session.user.name.last].join(" ");

  return (
    <Button
      size={size ?? ["sm", null, "md"]}
      variant={variant ?? "ghost"}
      rounded={rounded ?? "full"}
      px={[0, null, 4]}
      {...props}
    >
      <HStack>
        <Avatar.Root
          size={avatarProps?.size ?? ["xs", null, "sm"]}
          {...avatarProps}
        >
          <Avatar.Fallback name={name} />
          <Avatar.Image src={session.user.image ?? undefined} />
        </Avatar.Root>

        <Text
          hideBelow="md"
          maxW={40}
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {name}
        </Text>
      </HStack>
    </Button>
  );
}
