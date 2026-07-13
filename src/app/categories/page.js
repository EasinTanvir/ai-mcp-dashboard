import DashboardShell from "@/components/layout/DashboardShell";
import { ManagementView } from "@/components/pages/ManagementView";
import { getManagementData } from "@/db/queries";
import { requireAdmin } from "@/lib/auth";

const CustomerPage = async () => {
  const admin = await requireAdmin();
  const data = await getManagementData("categories");
  return (
    <DashboardShell active="Categories">
      <ManagementView type="Categories" data={data} role={admin.role} />
    </DashboardShell>
  );
};

export default CustomerPage;
