"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  RefreshCw,
  User,
  Mail,
  Phone,
  Camera,
  ShoppingBag,
  Store,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  /* ── helpers ── */
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
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone))
      e.phone = "Enter a valid phone number.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "At least 8 characters.";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    if (!form.role) e.role = "Choose a role to continue.";
    return e;
  };

  // Final handleSubmit — paste this into your RegisterPage

 const handleSubmit = async (e) => {
   e.preventDefault();

   const errs = validate();
   if (Object.keys(errs).length) {
     setErrors(errs);
     return;
   }

   setLoading(true);

   // Show Sonner loading spinner
   const toastId = toast.loading("Creating your account...");

   try {
     // Upload image
     let photoUrl = null;

     if (form.photo) {
       const imgData = new FormData();
       imgData.append("image", form.photo);

       const imgRes = await fetch(
         `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
         {
           method: "POST",
           body: imgData,
         },
       );

       if (!imgRes.ok) {
         throw new Error("Image upload failed. Try again.");
       }

       const imgJson = await imgRes.json();
       photoUrl = imgJson.data.url;
     }

     // Register user
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

       setErrors({
         form: error.message,
       });

       return;
     }

     // Success
     toast.dismiss(toastId);
     toast.success("Account created successfully!");

     setSubmitted(true);
   } catch (err) {
     toast.dismiss(toastId);

     toast.error(err.message ?? "Something went wrong.");

     console.error(err);

     setErrors({
       form: err.message ?? "Something went wrong.",
     });
   } finally {
     setLoading(false);
   }
 };

  /* ── password strength ── */
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
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-green-500",
  ][strength];

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
      <div className="w-full max-w-2xl">
        {/* ── Card ── */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Top accent strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700" />

          <div className="px-8 sm:px-12 py-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10">
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
                Create your account
              </h1>
              <p className="text-sm text-gray-500">
                Already have one?{" "}
                <Link
                  href="/login"
                  className="text-green-700 font-semibold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* ── Photo upload ── */}
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-24 h-24 rounded-full border-4 border-white ring-2 ring-green-200 bg-green-50 flex items-center justify-center overflow-hidden hover:ring-green-400 transition-all shadow-md"
                    aria-label="Upload profile photo"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-green-500">
                        <Camera size={26} />
                        <span className="text-[10px] font-medium">
                          Add photo
                        </span>
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

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhoto}
                />
                <p className="text-xs text-gray-400">
                  JPG, PNG or GIF · Max 5 MB
                </p>
              </div>

              {/* ── Name + Email (2-col) ── */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Full name"
                  icon={<User size={15} />}
                  error={errors.name}
                >
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={inputCls(errors.name)}
                  />
                </Field>

                <Field
                  label="Email address"
                  icon={<Mail size={15} />}
                  error={errors.email}
                >
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls(errors.email)}
                  />
                </Field>
              </div>

              {/* ── Phone ── */}
              <Field
                label="Phone number"
                icon={<Phone size={15} />}
                error={errors.phone}
              >
                <input
                  type="tel"
                  placeholder="+880 1305-290120"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputCls(errors.phone)}
                />
              </Field>

              {/* ── Role selector ── */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "buyer",
                      icon: ShoppingBag,
                      title: "Buy items",
                      sub: "Browse & purchase products",
                    },
                    {
                      value: "seller",
                      icon: Store,
                      title: "Sell items",
                      sub: "List & manage products",
                    },
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
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          form.role === value
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${form.role === value ? "text-green-700" : "text-gray-700"}`}
                        >
                          {title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                      </div>
                      {form.role === value && (
                        <CheckCircle2
                          size={16}
                          className="absolute top-2.5 right-2.5 text-green-600"
                        />
                      )}
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.role}</p>
                )}
              </div>

              {/* ── Password ── */}
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
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i <= strength ? strengthColor : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Strength:{" "}
                      <span
                        className={`font-semibold ${
                          strength <= 1
                            ? "text-red-500"
                            : strength === 2
                              ? "text-yellow-500"
                              : strength === 3
                                ? "text-blue-500"
                                : "text-green-600"
                        }`}
                      >
                        {strengthLabel}
                      </span>
                    </p>
                  </div>
                )}
              </Field>

              {/* ── Confirm password ── */}
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

              {/* ── Terms ── */}
              <p className="text-xs text-gray-400 text-center">
                By creating an account you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-green-700 hover:underline font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-green-700 hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-green-700 hover:bg-green-800 disabled:bg-green-500 disabled:cursor-not-allowed active:scale-[0.98] px-6 py-3.5 text-white font-semibold text-sm shadow-md transition-all mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
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

/* ── Shared field wrapper ── */
function Field({ label, icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <div className={icon ? "[&>input]:pl-9 [&>input]:pr-4" : ""}>
          {children}
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ── Input base classes ── */
function inputCls(hasError) {
  return [
    "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400",
    "focus:outline-none focus:ring-2 focus:bg-white transition-all",
    hasError
      ? "border-red-400 focus:ring-red-200"
      : "border-gray-200 focus:ring-green-200 focus:border-green-400",
  ].join(" ");
}
