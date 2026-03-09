import { AbsoluteCenter, Field, ProgressCircle } from "@chakra-ui/react";

interface Props {
  value: number;
  label?: string;
}

export default function MetricBase({ value, label }: Props) {
  return (
    <Field.Root orientation="horizontal" h={24} justifyContent="center">
      <Field.Label>{label}</Field.Label>
      <ProgressCircle.Root value={value} size="xl">
        <ProgressCircle.Circle scale={[1, null, 1.3, null, 2]}>
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Circle>
        <AbsoluteCenter>
          <ProgressCircle.ValueText />
        </AbsoluteCenter>
      </ProgressCircle.Root>
    </Field.Root>
  );
}
