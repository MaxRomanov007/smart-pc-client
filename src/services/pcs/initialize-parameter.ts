import {
  type CommandParameter,
  type CommandParameterValueType,
  ParameterTypes,
} from "@/types/pc/command-parameter";

function getDefaultValue(type: ParameterTypes): CommandParameterValueType {
  switch (type) {
    case ParameterTypes.boolean:
      return false;
    case ParameterTypes.number:
      return 0;
    case ParameterTypes.string:
      return "";
  }
}

export function initializeParameter(raw: CommandParameter): CommandParameter {
  if (raw.value !== undefined || raw.type === undefined) return raw;

  return {
    ...raw,
    value: getDefaultValue(raw.type),
    shouldConvertToString: true,
  } as CommandParameter;
}
