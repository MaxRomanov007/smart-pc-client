import { Suspense } from "react";
import { AbsoluteCenter, Spinner } from "@chakra-ui/react";
import AuthCallbackInner from "./auth-callback-inner";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <AbsoluteCenter>
          <Spinner size="xl" />
        </AbsoluteCenter>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
