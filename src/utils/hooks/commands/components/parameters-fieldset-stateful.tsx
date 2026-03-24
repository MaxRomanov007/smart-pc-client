"use client";

import { type RefObject, useCallback, useEffect } from "react";
import type { CommandParameter } from "@/types/pc/command-parameter";
import ParametersFieldset from "@/utils/hooks/commands/components/parameters-fieldset";
import {
  pcCommandParametersQueryKeys,
  usePcCommandParametersQuery,
} from "@/utils/hooks/queries/pcs/commands/parameters";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  initialParameters: CommandParameter[];
  text: string;
  parametersRef: RefObject<CommandParameter[]>;
  shouldRequest?: boolean;
  commandId: string;
  pcId: string;
}

export function ParametersFieldsetStateful({
  initialParameters,
  text,
  parametersRef,
  shouldRequest,
  commandId,
  pcId,
}: Props) {
  const { data } = usePcCommandParametersQuery(pcId, commandId, {
    enabled: shouldRequest,
    placeholder: initialParameters,
  });
  const queryClient = useQueryClient();

  const handleChange = useCallback(
    (p: CommandParameter) => {
      queryClient.setQueryData<CommandParameter[]>(
        pcCommandParametersQueryKeys.pcCommandParameters(pcId, commandId),
        (prev) => {
          if (!prev) {
            return prev;
          }

          return prev.map((param) => (param.id === p.id ? p : param));
        },
      );
    },
    [commandId, pcId, queryClient],
  );

  useEffect(() => {
    if (!data) return;
    parametersRef.current = data;
  }, [data, parametersRef]);

  if (!data) return null;

  return (
    <ParametersFieldset
      parameters={data}
      onParameterChange={handleChange}
      text={text}
    />
  );
}
