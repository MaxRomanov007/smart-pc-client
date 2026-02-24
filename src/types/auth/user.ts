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
