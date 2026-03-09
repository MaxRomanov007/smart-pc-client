import { AbsoluteCenter, Field, ProgressCircle } from "@chakra-ui/react";

interface Props {
  value: number;
  label?: string;
}

export default function MetricBase({ value, label }: Props) {
  if (isNaN(value)) return null;

  return (
    <Field.Root
      orientation="horizontal"
      h={[24, null, 32, 48, 16]}
      justifyContent="center"
    >
      <Field.Label>{label}</Field.Label>
      <ProgressCircle.Root value={value} size="xl" ms={[0, null, null, 6]}>
        <ProgressCircle.Circle scale={[1.3, 1.5, 2, 3, 3]}>
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
