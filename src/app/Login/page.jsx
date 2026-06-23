"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw, Mail, Eye, EyeOff, ArrowRight, Chrome } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: "/",
      });

      if (error) {
        setErrors({ form: error.message ?? "Invalid email or password." });
        return;
      }

      router.push("/");
    } catch (err) {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/" });
  };

  return (
    <div className="min-h-screen bg-[#f2f5f0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ── Card ── */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Top accent strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700" />

          <div className="px-8 sm:px-10 py-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <Link href="/" className="flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                  <RefreshCw size={18} className="text-white" />
                </div>
                <div className="flex flex-col leading-none text-left">
                  <span className="font-bold text-gray-900 text-[15px]">
                    ReSell Hub
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium tracking-widest uppercase">
                    marketplace
                  </span>
                </div>
              </Link>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                Welcome back
              </h1>
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-green-700 font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-all mb-6"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.96L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">
                or sign in with email
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={[
                      "w-full rounded-xl border bg-gray-50 pl-9 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400",
                      "focus:outline-none focus:ring-2 focus:bg-white transition-all",
                      errors.email
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:ring-green-200 focus:border-green-400",
                    ].join(" ")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-green-700 font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={[
                      "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 pr-10",
                      "focus:outline-none focus:ring-2 focus:bg-white transition-all",
                      errors.password
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:ring-green-200 focus:border-green-400",
                    ].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Form-level error */}
              {errors.form && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    className="shrink-0"
                  >
                    <circle
                      cx="7.5"
                      cy="7.5"
                      r="7"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7.5 4v4M7.5 10.5v.5"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {errors.form}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-green-700 hover:bg-green-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3.5 text-white font-semibold text-sm shadow-md transition-all mt-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} ReSell Hub · All rights reserved.
        </p>
      </div>
    </div>
  );
}
