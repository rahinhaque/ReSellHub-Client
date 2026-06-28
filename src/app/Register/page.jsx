"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  RefreshCw, User, Mail, Phone, Camera,
  ShoppingBag, Store, Eye, EyeOff, ArrowRight,
  CheckCircle2, X,
} from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { motion } from "motion/react";

function GoogleButton({ onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
        <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.96L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
      </svg>
      {loading ? "Redirecting…" : "Continue with Google"}
    </button>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    password: "", confirmPassword: "",
    role: "", photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const fileRef = useRef(null);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set("photo", file);
    setPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    set("photo", null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "At least 8 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (!form.role) e.role = "Choose a role to continue.";
    return e;
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      // Google OAuth handles the full flow — role defaults to "buyer"
      // User can update their role later from profile settings
      await signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      toast.error("Google sign-up failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      let photoUrl = null;

      if (form.photo) {
        const imgData = new FormData();
        imgData.append("image", form.photo);
        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: "POST", body: imgData }
        );
        if (!imgRes.ok) throw new Error("Image upload failed. Try again.");
        const imgJson = await imgRes.json();
        photoUrl = imgJson.data.url;
      }

      const { data, error } = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: photoUrl ?? undefined,
        phone: form.phone,
        role: form.role,
      });

      if (error) {
        toast.dismiss(toastId);
        toast.error(error.message);
        setErrors({ form: error.message });
        return;
      }

      toast.dismiss(toastId);
      toast.success("Account created successfully!");
      setSubmitted(true);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message ?? "Something went wrong.");
      setErrors({ form: err.message ?? "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f2f5f0] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're in!</h2>
          <p className="text-gray-500 mb-8">
            Welcome to ReSell Hub,{" "}
            <span className="font-semibold text-gray-700">{form.name}</span>.
            Your account is ready.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-green-700 hover:bg-green-800 px-8 py-3 text-white font-semibold text-sm transition-all"
          >
            Go to marketplace <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f5f0] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 16 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700" />

          <div className="px-8 sm:px-12 py-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <Link href="/" className="flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                  <RefreshCw size={18} className="text-white" />
                </div>
                <div className="flex flex-col leading-none text-left">
                  <span className="font-bold text-gray-900 text-[15px]">ReSell Hub</span>
                  <span className="text-[10px] text-emerald-600 font-medium tracking-widest uppercase">marketplace</span>
                </div>
              </Link>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                Create your account
              </h1>
              <p className="text-sm text-gray-500">
                Already have one?{" "}
                <Link href="/login" className="text-green-700 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            {/* Google */}
            <GoogleButton onClick={handleGoogle} loading={googleLoading} />

            {/* Google note */}
            <p className="text-center text-xs text-gray-400 mt-2 mb-5">
              Google accounts are registered as buyers by default.
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or register with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Photo upload */}
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-24 h-24 rounded-full border-4 border-white ring-2 ring-green-200 bg-green-50 flex items-center justify-center overflow-hidden hover:ring-green-400 transition-all shadow-md"
                    aria-label="Upload profile photo"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-green-500">
                        <Camera size={26} />
                        <span className="text-[10px] font-medium">Add photo</span>
                      </div>
                    )}
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                      aria-label="Remove photo"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                <p className="text-xs text-gray-400">JPG, PNG or GIF · Max 5 MB</p>
              </div>

              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" icon={<User size={15} />} error={errors.name}>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={inputCls(errors.name)}
                  />
                </Field>
                <Field label="Email address" icon={<Mail size={15} />} error={errors.email}>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls(errors.email)}
                  />
                </Field>
              </div>

              {/* Phone */}
              <Field label="Phone number" icon={<Phone size={15} />} error={errors.phone}>
                <input
                  type="tel"
                  placeholder="+880 1305-290120"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputCls(errors.phone)}
                />
              </Field>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "buyer", icon: ShoppingBag, title: "Buy items", sub: "Browse & purchase products" },
                    { value: "seller", icon: Store, title: "Sell items", sub: "List & manage products" },
                  ].map(({ value, icon: Icon, title, sub }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set("role", value)}
                      className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all ${
                        form.role === value
                          ? "border-green-600 bg-green-50 shadow-sm"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50/40"
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        form.role === value ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${form.role === value ? "text-green-700" : "text-gray-700"}`}>
                          {title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                      </div>
                      {form.role === value && (
                        <CheckCircle2 size={16} className="absolute top-2.5 right-2.5 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
                {errors.role && <p className="mt-1.5 text-xs text-red-500">{errors.role}</p>}
              </div>

              {/* Password */}
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={inputCls(errors.password) + " pr-10"}
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
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Strength:{" "}
                      <span className={`font-semibold ${
                        strength <= 1 ? "text-red-500" : strength === 2 ? "text-yellow-500" : strength === 3 ? "text-blue-500" : "text-green-600"
                      }`}>
                        {strengthLabel}
                      </span>
                    </p>
                  </div>
                )}
              </Field>

              {/* Confirm password */}
              <Field label="Confirm password" error={errors.confirmPassword}>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    className={inputCls(errors.confirmPassword) + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              {/* Form error */}
              {errors.form && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0 mt-0.5">
                    <circle cx="7.5" cy="7.5" r="7" stroke="#ef4444" strokeWidth="1.5" />
                    <path d="M7.5 4v4M7.5 10.5v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {errors.form}
                </div>
              )}

              {/* Terms */}
              <p className="text-xs text-gray-400 text-center">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="text-green-700 hover:underline font-medium">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-green-700 hover:underline font-medium">Privacy Policy</Link>.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-green-700 hover:bg-green-800 disabled:bg-green-500 disabled:cursor-not-allowed active:scale-[0.98] px-6 py-3.5 text-white font-semibold text-sm shadow-md transition-all mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>Create account <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} ReSell Hub · All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <div className={icon ? "[&>input]:pl-9 [&>input]:pr-4" : ""}>{children}</div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError) {
  return [
    "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400",
    "focus:outline-none focus:ring-2 focus:bg-white transition-all",
    hasError
      ? "border-red-400 focus:ring-red-200"
      : "border-gray-200 focus:ring-green-200 focus:border-green-400",
  ].join(" ");
}
