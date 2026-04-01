import type { Metadata } from "next";
import OnlinePcs from "@/app/[locale]/dashboard/(components)/pcs/online-pcs";
import Header from "@/app/[locale]/dashboard/(components)/header";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  return (
    <>
      <Header />
      <OnlinePcs />
    </>
  );
}
