import DashboardShell from "@/components/layout/DashboardShell";
import DashboardView from "@/components/dashboard/DashboardView";
import { getDashboardData } from "@/db/queries";

import { requireAdmin } from "@/lib/auth";

const Home = async () => {
  await requireAdmin();
  const data = await getDashboardData();
  return (
    <DashboardShell active="Dashboard">
      <DashboardView data={data} />
    </DashboardShell>
  );
};

export default Home;
