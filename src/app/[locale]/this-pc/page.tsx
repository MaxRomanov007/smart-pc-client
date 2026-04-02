import { AgentOnlineOnlyView } from "./(components)/agent-online-only-view";
import { ThisPcBreadcrumbs } from "./(components)/this-pc-breadcrumbs";
import Header from "./(components)/header";

export default async function Page() {
  return (
    <ThisPcBreadcrumbs>
      <Header />
      <AgentOnlineOnlyView h="full" />
    </ThisPcBreadcrumbs>
  );
}
