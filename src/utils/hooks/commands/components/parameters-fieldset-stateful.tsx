"use client";

import { type RefObject, useCallback, useState } from "react";
import type { CommandParameter } from "@/types/pc/command-parameter";
import ParametersFieldset from "@/utils/hooks/commands/components/parameters-fieldset";

export function ParametersFieldsetStateful({
  initialParameters,
  text,
  parametersRef,
}: {
  initialParameters: CommandParameter[];
  text: string;
  parametersRef: RefObject<CommandParameter[]>;
}) {
  const [parameters, setParameters] =
    useState<CommandParameter[]>(initialParameters);

  const handleChange = useCallback(
    (p: CommandParameter) => {
      setParameters((prev) => {
        const next = prev.map((param) => (param.id === p.id ? p : param));
        parametersRef.current = next;
        return next;
      });
    },
    [parametersRef],
  );

  return (
    <ParametersFieldset
      parameters={parameters}
      onParameterChange={handleChange}
      text={text}
    />
  );
}
