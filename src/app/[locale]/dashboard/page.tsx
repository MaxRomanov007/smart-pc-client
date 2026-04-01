import type { Metadata } from "next";
import OnlinePcs from "@/app/[locale]/dashboard/(components)/pcs/online-pcs";
import Header from "@/app/[locale]/dashboard/(components)/header";
import { DashboardBreadcrumbs } from "@/app/[locale]/dashboard/(components)/dashboard-breadcrumbs";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  return (
    <DashboardBreadcrumbs>
      <Header />
      <OnlinePcs />
    </DashboardBreadcrumbs>
  );
}
