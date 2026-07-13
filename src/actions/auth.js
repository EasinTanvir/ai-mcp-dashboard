"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { loginSchema } from "@/lib/validation";
const setSession = async (admin) => {
  const store = await cookies();
  store.set("nexa_admin", admin.email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
};
export async function loginAsDemo() {
  const admin = await db.query.admins.findFirst({
    where: eq(admins.role, "demo"),
  });
  if (!admin) {
    console.error("Demo administrator is unavailable. Run the database seed.");
    throw new Error(
      "Demo administrator is unavailable. Run the database seed.",
    );
  }

  await setSession(admin);
  //redirect("/");
}
export async function loginAsReal(formData) {
  console.log("formData", formData);

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  console.log("parsed", parsed);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const admin = await db.query.admins.findFirst({
    where: eq(admins.email, parsed.data.email),
  });
  if (
    !admin ||
    admin.role !== "real" ||
    !admin.passwordHash ||
    !(await bcrypt.compare(parsed.data.password, admin.passwordHash))
  )
    return { error: "Invalid administrator credentials." };
  await setSession(admin);
}
export async function logout() {
  const store = await cookies();
  store.delete("nexa_admin");
  redirect("/login");
}
export async function getCurrentAdmin() {
  const email = (await cookies()).get("nexa_admin")?.value;
  if (!email) return null;
  return db.query.admins.findFirst({
    where: eq(admins.email, email),
    columns: { id: true, name: true, email: true, role: true },
  });
}
export async function isAdmin() {
  return Boolean(await getCurrentAdmin());
}
