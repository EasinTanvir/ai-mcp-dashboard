"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { loginAsDemo, loginAsReal } from "@/actions/auth";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await loginAsReal(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // redirect handled in server action
    } catch (error) {
      toast.error(result.error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDemoSubmit = async () => {
    setDemoLoading(true);

    try {
      await loginAsDemo();
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while logging in as demo admin.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        {/* Logo */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
          <Sparkles size={20} />
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your dashboard.
          </p>
        </div>

        {/* Demo Login */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <button
            disabled={demoLoading}
            onClick={onDemoSubmit}
            type="submit"
            className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            {demoLoading ? "Logging in..." : "Login as Demo Admins"}
          </button>
        </div>

        {/* Real Login */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@nexa.local"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {String(errors.email.message)}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {String(errors.password.message)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
