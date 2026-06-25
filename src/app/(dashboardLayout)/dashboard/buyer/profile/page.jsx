"use client";

import { useState, useRef } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Loader2,
  BadgeCheck,
  Pencil,
  X,
} from "lucide-react";
import Image from "next/image";

export default function BuyerProfileManagement() {
  const { data: session } = useSession();
  const user = session?.user;
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  // Sync form when session loads
  if (user && form.name === "" && !editing) {
    setForm({ name: user.name || "", phone: user.phone || "" });
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setForm({ name: user?.name || "", phone: user?.phone || "" });
  };

const handleSave = async () => {
  try {
    setSaving(true);

    let imageUrl = user?.image;

    if (avatarFile) {
      imageUrl = await uploadToImgBB(avatarFile);
    }

    const { error } = await authClient.updateUser({
      name: form.name,
      image: imageUrl,
      phone: form.phone, // ✅ works now because of inferAdditionalFields
    });

    if (error) throw new Error(error.message);

    setSuccess(true);
    setEditing(false);
    setTimeout(() => setSuccess(false), 3000);
  } catch (err) {
    console.error("❌ Update failed:", err);
  } finally {
    setSaving(false);
  }
};

  const displayAvatar =
    avatarPreview ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=059669&color=fff&bold=true`;

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your personal information
          </p>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <Pencil size={14} />
            Edit profile
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
          >
            <X size={14} />
            Cancel
          </button>
        )}
      </div>

      {/* ── Success banner ── */}
      {success && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <BadgeCheck size={16} className="text-emerald-500 shrink-0" />
          Profile updated successfully.
        </div>
      )}

      {/* ── Avatar card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-gray-100">
              {user?.image || avatarPreview ? (
                <img
                  src={displayAvatar}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                  {initials}
                </div>
              )}
            </div>

            {editing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-md border-2 border-white transition-colors"
                title="Change photo"
              >
                <Camera size={13} className="text-white" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">
              {user?.name || "—"}
            </p>
            <p className="text-sm text-gray-400 truncate mt-0.5">
              {user?.email}
            </p>
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">
              <BadgeCheck size={10} />
              {user?.role || "buyer"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Info fields ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Personal details
        </p>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <User size={14} className="text-gray-400" />
            Full name
          </label>
          {editing ? (
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
            />
          ) : (
            <p className="px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-700 border border-gray-100">
              {user?.name || "—"}
            </p>
          )}
        </div>

        {/* Email — always read-only */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Mail size={14} className="text-gray-400" />
            Email address
            <span className="text-[10px] text-gray-400 font-normal">
              (cannot be changed)
            </span>
          </label>
          <p className="px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-400 border border-gray-100 cursor-not-allowed">
            {user?.email || "—"}
          </p>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Phone size={14} className="text-gray-400" />
            Phone number
          </label>
          {editing ? (
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+880 1X XX XXX XXX"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
            />
          ) : (
            <p className="px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-700 border border-gray-100">
              {user?.phone || (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </p>
          )}
        </div>

        {/* Role — always read-only */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <BadgeCheck size={14} className="text-gray-400" />
            Account role
            <span className="text-[10px] text-gray-400 font-normal">
              (cannot be changed)
            </span>
          </label>
          <p className="px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-400 border border-gray-100 cursor-not-allowed capitalize">
            {user?.role || "buyer"}
          </p>
        </div>
      </div>

      {/* ── Save button ── */}
      {editing && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={15} />
              Save changes
            </>
          )}
        </button>
      )}
    </div>
  );
}
