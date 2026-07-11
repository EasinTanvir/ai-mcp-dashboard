import DashboardShell from "@/components/layout/DashboardShell";
import { ReviewsView } from "@/components/pages/ManagementView";
import { getManagementData } from "@/db/queries";
import { requireAdmin } from "@/lib/auth";
export default async function Page() {
  await requireAdmin();
  return (
    <DashboardShell active="Reviews">
      <ReviewsView data={await getManagementData("reviews")} />
    </DashboardShell>
  );
}
