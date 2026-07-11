import DashboardShell from "@/components/layout/DashboardShell";
import { ManagementView } from "@/components/pages/ManagementView";
import { getManagementData } from "@/db/queries";
import { requireAdmin } from "@/lib/auth";
export default async function Page() {
  const admin = await requireAdmin();
  return (
    <DashboardShell active="Categories">
      <ManagementView
        type="Categories"
        data={await getManagementData("categories")}
        role={admin.role}
      />
    </DashboardShell>
  );
}
