import { type IAuthContext, useAuthContext } from "react-oauth2-code-pkce";
import type { IUser } from "@/types/auth/user";
import type {
  TLoginMethod,
  TPrimitiveRecord,
} from "react-oauth2-code-pkce/dist/types";
import { generateState } from "@/utils/strings/state";
import { useEffect } from "react";
import { unauthorized } from "next/dist/client/components/unauthorized";
import { LOGIN_REDIRECT_PATH_KEY } from "@/config/storage";

export interface IUseAuthResult extends Omit<IAuthContext, "logIn"> {
  logIn: (
    redirectPath?: string,
    state?: string,
    additionalParameters?: TPrimitiveRecord,
    method?: TLoginMethod,
  ) => void;
  user?: IUser;
  isAuthenticated: boolean;
}

export function useAuth(): IUseAuthResult {
  const authContext = useAuthContext();

  const logIn = (
    redirectPath?: string,
    state?: string,
    additionalParameters?: TPrimitiveRecord,
    method?: TLoginMethod,
  ) => {
    state = state ? state : generateState();

    if (redirectPath) {
      sessionStorage.setItem(LOGIN_REDIRECT_PATH_KEY, redirectPath);
    }

    authContext.logIn(state, additionalParameters, method);
  };

  if (authContext.error || !authContext.token) {
    return { ...authContext, logIn, isAuthenticated: false };
  }

  if (authContext.idTokenData) {
    const user: IUser = {
      id: authContext.idTokenData["sub"],
      email: authContext.idTokenData["traits"]?.email,
      name: {
        first: authContext.idTokenData["traits"]?.name?.first,
        last: authContext.idTokenData["traits"]?.name?.last,
      },
      picture: authContext.idTokenData["traits"]?.picture,
    };
    return { ...authContext, logIn, user, isAuthenticated: true };
  }

  return { ...authContext, logIn, isAuthenticated: true };
}

export function useSecureAuth() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      unauthorized();
    }
  }, [auth.isAuthenticated]);

  return auth;
}
