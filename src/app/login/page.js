import React from "react";
import { getCurrentAdmin } from "@/actions/auth";
import { redirect } from "next/navigation";
import Login from "@/components/pages/login/Login";

const LoginPage = async () => {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/");
  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;
