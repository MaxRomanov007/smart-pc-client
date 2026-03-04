export enum ParameterTypes {
  boolean = 1,
  number = 2,
  string = 3,
}

export type CommandParameterValueType = boolean | number | string;

type ParameterTypeFromValueType<T extends CommandParameterValueType> =
  T extends boolean
    ? ParameterTypes.boolean
    : T extends number
      ? ParameterTypes.number
      : ParameterTypes.string;

export interface ICommandParameter<T extends CommandParameterValueType> {
  id: string;
  name: string;
  description: string;
  type: ParameterTypeFromValueType<T>;
  value: T;
}

export type CommandParameter =
  | ICommandParameter<boolean>
  | ICommandParameter<number>
  | ICommandParameter<string>;
