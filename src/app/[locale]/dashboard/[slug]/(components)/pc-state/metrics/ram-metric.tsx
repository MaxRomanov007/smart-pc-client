import { useExtracted } from "next-intl";
import MetricBase from "@/app/[locale]/dashboard/[slug]/(components)/pc-state/metrics/base";

interface Props {
  total: number;
  available: number;
}

export default function RamMetric({ total, available }: Props) {
  const t = useExtracted("metrics");

  return (
    <MetricBase
      value={100 - (available / total) * 100}
      label={t({
        message: "RAM:",
        description: "ram metric label",
      })}
    />
  );
}
