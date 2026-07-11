import DashboardShell from '@/components/layout/DashboardShell'; import AnalyticsView from '@/components/pages/AnalyticsView'; import {requireAdmin} from '@/lib/auth';
export default async function Page(){await requireAdmin();return <DashboardShell active="Analytics"><AnalyticsView/></DashboardShell>}
