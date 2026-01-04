import { Avatar, Button, HStack, Text } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import type { User } from "@/utils/auth/client";

interface Props extends Omit<ComponentProps<typeof Button>, "children"> {
  user: User;
  avatarProps?: ComponentProps<typeof Avatar.Root>;
}

export default function ProfileButton({
  user,
  size,
  variant,
  rounded,
  avatarProps,
  ...props
}: Props) {
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
          <Avatar.Fallback name={user.name} />
          <Avatar.Image src={user.image ?? ""} />
        </Avatar.Root>

        <Text hideBelow="md">{user.name}</Text>
      </HStack>
    </Button>
  );
}
