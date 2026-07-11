"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { loginAsDemo, loginAsReal } from "@/actions/auth";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  Loader2,
} from "lucide-react";

const Login = () => {
  const [loading, setLoading] = useState(false);

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

      // Success: redirect() inside the server action will handle navigation.
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-[#101828] p-5">
      <div className="absolute h-96 w-96 -translate-x-40 -translate-y-40 rounded-full bg-indigo-600/30 blur-3xl" />

      <section className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-slate-900/80 p-7 text-white shadow-2xl backdrop-blur sm:p-9">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600">
          <Sparkles size={22} />
        </div>

        <p className="mt-8 text-sm font-semibold text-indigo-300">
          Nexa workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Welcome back.
        </h1>

        <p className="mt-3 leading-6 text-slate-400">
          Choose a safe demo session or sign in as the workspace administrator.
        </p>

        {/* Demo Login */}
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" size={21} />

            <div>
              <p className="text-sm font-semibold">Demo Admin</p>

              <p className="mt-0.5 text-xs text-slate-400">
                Read-only portfolio access
              </p>
            </div>
          </div>

          <form action={loginAsDemo}>
            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-indigo-50"
            >
              Login as Demo Admin
              <ArrowRight size={17} />
            </button>
          </form>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
          <i className="h-px flex-1 bg-white/10" />
          Real administrator
          <i className="h-px flex-1 bg-white/10" />
        </div>

        {/* Real Admin Login */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <label className="block text-xs font-medium text-slate-300">
            Email
            <input
              type="email"
              placeholder="admin@nexa.local"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-400"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </label>

          <label className="block text-xs font-medium text-slate-300">
            Password
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-400"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Signing in...
              </>
            ) : (
              <>
                <KeyRound size={16} />
                Login as Real Admin
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Test credentials: admin@nexa.local · NexaAdmin2026!
        </p>
      </section>
    </main>
  );
};

export default Login;
