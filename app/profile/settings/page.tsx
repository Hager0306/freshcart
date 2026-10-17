"use client";

import { faEye, faEyeSlash, faFloppyDisk, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { emailRe, passRe, phoneRe } from "@/components/Field";
import { useAuth } from "@/components/Providers";
import { changePassword, errorMessage, updateMe } from "@/lib/api";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-5 py-4 outline-none placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

function PwInput({ label, hint, value, onChange, placeholder }: { label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-2 block text-gray-700">{label}</label>
      <div className="relative">
        <input type={show ? "text" : "password"} className={`${inputCls} pr-12`} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Toggle password">
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
        </button>
      </div>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const { user, login } = useAuth();
  const [info, setInfo] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", password: "", rePassword: "" });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (user?.name) setInfo((i) => (i.name ? i : { ...i, name: user.name }));
  }, [user]);

  const saveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (info.name.trim().length < 3) return toast.error("Name must be at least 3 characters");
    if (!emailRe.test(info.email)) return toast.error("Enter a valid email");
    if (info.phone && !phoneRe.test(info.phone)) return toast.error("Enter a valid Egyptian phone number");
    setSaving(true);
    try {
      await updateMe({ name: info.name, email: info.email, phone: info.phone });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const savePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.currentPassword) return toast.error("Enter your current password");
    if (!passRe.test(pw.password)) return toast.error("Password must be at least 6 characters");
    if (pw.password !== pw.rePassword) return toast.error("Passwords do not match");
    setSavingPw(true);
    try {
      const res = await changePassword(pw);
      if (res.token) login(res.token);
      toast.success("Password changed successfully");
      setPw({ currentPassword: "", password: "", rePassword: "" });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSavingPw(false);
    }
  };

  const tile = (cls: string, icon: typeof faUser) => (
    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl ${cls}`}><FontAwesomeIcon icon={icon} /></span>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
      <p className="mb-6 text-gray-600">Update your profile information and change your password</p>

      <div className="space-y-8">
        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <form onSubmit={saveInfo} className="space-y-6 p-10">
            <div className="flex items-center gap-4">
              {tile("bg-primary-50 text-primary-600", faUser)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                <p className="text-gray-600">Update your personal details</p>
              </div>
            </div>
            <label className="block text-gray-700">Full Name
              <input className={`${inputCls} mt-2`} value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
            </label>
            <label className="block text-gray-700">Email Address
              <input type="email" className={`${inputCls} mt-2`} placeholder="Enter your email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
            </label>
            <label className="block text-gray-700">Phone Number
              <input type="tel" className={`${inputCls} mt-2`} placeholder="01xxxxxxxxx" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
            </label>
            <button disabled={saving} className="rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 disabled:opacity-60">
              <FontAwesomeIcon icon={faFloppyDisk} className="mr-3" />{saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
          <div className="border-t border-gray-100 bg-gray-50/60 p-10">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Information</h3>
            <dl className="space-y-4 text-gray-600">
              <div className="flex justify-between"><dt>User ID</dt><dd className="font-mono text-sm text-gray-800">{user?.id}</dd></div>
              <div className="flex justify-between"><dt>Role</dt><dd className="capitalize text-gray-800">{user?.role ?? "user"}</dd></div>
            </dl>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
          <form onSubmit={savePw} className="space-y-6">
            <div className="flex items-center gap-4">
              {tile("bg-amber-100 text-orange-500", faLock)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                <p className="text-gray-600">Update your account password</p>
              </div>
            </div>
            <PwInput label="Current Password" placeholder="Enter your current password" value={pw.currentPassword} onChange={(v) => setPw({ ...pw, currentPassword: v })} />
            <PwInput label="New Password" hint="Must be at least 6 characters" placeholder="Enter your new password" value={pw.password} onChange={(v) => setPw({ ...pw, password: v })} />
            <PwInput label="Confirm New Password" placeholder="Confirm your new password" value={pw.rePassword} onChange={(v) => setPw({ ...pw, rePassword: v })} />
            <button disabled={savingPw} className="rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 disabled:opacity-60">
              <FontAwesomeIcon icon={faLock} className="mr-3" />{savingPw ? "Please wait..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
