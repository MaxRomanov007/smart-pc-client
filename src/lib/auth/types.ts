export interface IUserName {
  first: string;
  last: string;
}

export interface IUser {
  id: string;
  email: string;
  name: IUserName;
  picture: string;
}

export interface ITokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

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

export interface ISessionData {
  accessToken: string;
  expiresIn: number;
}

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface IAuthContext extends IAuthState {
  login: (redirectPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  getValidToken: () => Promise<string | null>;
}

export interface IRefreshResult {
  access_token: string;
  expires_in: number;
}
