import DashboardShell from "@/components/layout/DashboardShell";
import AnalyticsView from "@/components/pages/AnalyticsView";
import { requireAdmin } from "@/lib/auth";

const Page = async () => {
  await requireAdmin();
  return (
    <DashboardShell active="Analytics">
      <AnalyticsView />
    </DashboardShell>
  );
};

export default Page;
