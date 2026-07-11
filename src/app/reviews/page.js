import DashboardShell from "@/components/layout/DashboardShell";
import { ReviewsView } from "@/components/pages/ManagementView";
export default function Page() {
  return (
    <DashboardShell active="Reviews">
      <ReviewsView />
    </DashboardShell>
  );
}
