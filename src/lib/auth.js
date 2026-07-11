import "server-only";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/actions/auth";
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");
  return admin;
}
