import DashboardShell from "@/components/layout/DashboardShell";
import { ManagementView } from "@/components/pages/ManagementView";
import { getManagementData } from "@/db/queries";
import { requireAdmin } from "@/lib/auth";
export default async function Page() {
  const admin = await requireAdmin();
  return (
    <DashboardShell active="Customers">
      <ManagementView
        type="Customers"
        data={await getManagementData("customers")}
        role={admin.role}
      />
    </DashboardShell>
  );
}
