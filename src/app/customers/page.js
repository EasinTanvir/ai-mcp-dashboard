import DashboardShell from "@/components/layout/DashboardShell";
import { ManagementView } from "@/components/pages/ManagementView";
export default function Page() {
  return (
    <DashboardShell active="Customers">
      <ManagementView type="Customers" />
    </DashboardShell>
  );
}
