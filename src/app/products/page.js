import DashboardShell from "@/components/layout/DashboardShell";
import { ManagementView } from "@/components/pages/ManagementView";
import { getManagementData } from "@/db/queries";
import { requireAdmin } from "@/lib/auth";
export default async function Page() {
  const admin = await requireAdmin();
  return (
    <DashboardShell active="Products">
      <ManagementView
        type="Products"
        data={await getManagementData("products")}
        role={admin.role}
      />
    </DashboardShell>
  );
}
