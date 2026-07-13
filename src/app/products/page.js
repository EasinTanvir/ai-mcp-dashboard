import DashboardShell from "@/components/layout/DashboardShell";
import { ManagementView } from "@/components/pages/ManagementView";
import { getManagementData } from "@/db/queries";
import { requireAdmin } from "@/lib/auth";

const Page = async () => {
  const admin = await requireAdmin();
  const data = await getManagementData("products");
  return (
    <DashboardShell active="Products">
      <ManagementView type="Products" data={data} role={admin.role} />
    </DashboardShell>
  );
};

export default Page;
