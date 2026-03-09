import { useExtracted } from "next-intl";
import MetricBase from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/metrics/base";

interface Props {
  percent: number;
}

export default function CpuMetric({ percent }: Props) {
  const t = useExtracted("metrics");

  return (
    <MetricBase
      value={percent}
      label={t({
        message: "CPU:",
        description: "cpu metric label",
      })}
    />
  );
}
