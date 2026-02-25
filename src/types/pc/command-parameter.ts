export enum ParameterTypes {
  boolean = 1,
  number = 2,
  string = 3,
}

export interface ICommandParameterBase<
  T extends ParameterTypes,
  V extends string | number | boolean,
> {
  id: string;
  name: string;
  description: string;
  type: T;
  value: V;
}

export type CommandParameter =
  | ICommandParameterBase<ParameterTypes.boolean, boolean>
  | ICommandParameterBase<ParameterTypes.number, number>
  | ICommandParameterBase<ParameterTypes.string, string>;
