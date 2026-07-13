import DashboardShell from "@/components/layout/DashboardShell";
import { ManagementView } from "@/components/pages/ManagementView";
import { getManagementData } from "@/db/queries";
import { requireAdmin } from "@/lib/auth";

const Page = async () => {
  await requireAdmin();
  const data = await getManagementData("orders");
  return (
    <DashboardShell active="Orders">
      <ManagementView type="Orders" data={data} />
    </DashboardShell>
  );
};

export default Page;
