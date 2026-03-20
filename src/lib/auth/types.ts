/**
 * types.ts — общие типы для auth модуля
 */

export interface IUserName {
  first: string;
  last: string;
}

export interface IUser {
  id: string; // sub из JWT
  email: string; // traits.email (Ory формат)
  name: IUserName; // traits.name
  picture: string; // traits.picture
}

/** Ответ OAuth сервера при обмене code → tokens */
export interface ITokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

/** Декодированный id_token payload (Ory Kratos формат) */
export interface IOryIdTokenPayload {
  sub: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
  traits?: {
    email?: string;
    name?: {
      first?: string;
      last?: string;
    };
    picture?: string;
  };
}

/** Состояние AuthContext */
export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/** Публичный интерфейс AuthContext */
export interface IAuthContext extends IAuthState {
  login: (redirectPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  getValidToken: () => Promise<string | null>;
}
