import { Flex, Spacer } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import React from "react";
import { type IPcLog } from "@/types/pc/pc-log";
import { useLogTypeProps } from "@/components/pc/log/log-types/utils";
import LogBase from "@/components/pc/log/log-types/log-base";
import LogInfoTip from "@/components/pc/log/log-info-tip/log-info-tip";

interface Props extends ComponentProps<typeof Flex> {
  log: IPcLog;
}

export default React.memo(function Log({ log, ...props }: Props) {
  const logBaseProps = useLogTypeProps(log);

  return (
    <Flex direction="row" {...props}>
      {logBaseProps ? (
        <LogBase minW={0} flexGrow={0} {...logBaseProps} />
      ) : (
        <LogBase minW={0} flexGrow={0} log={log} />
      )}
      <Spacer />
      <LogInfoTip log={log} buttonProps={{ mr: 4 }} />
    </Flex>
  );
});
