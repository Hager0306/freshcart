"use client";

import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faBoxOpen, faShieldHalved, faStar, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { emailRe, Field, passRe, phoneRe, SubmitButton } from "@/components/Field";
import { errorMessage, signUp } from "@/lib/api";

const features = [
  { icon: faStar, title: "Premium Quality", text: "Premium quality products sourced from trusted suppliers." },
  { icon: faTruckFast, title: "Fast Delivery", text: "Same-day delivery available in most areas" },
  { icon: faShieldHalved, title: "Secure Shopping", text: "Your data and payments are completely secure" },
];

function strength(p: string) {
  let n = 0;
  if (p.length >= 8) n++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) n++;
  if (/\d/.test(p)) n++;
  if (/[^A-Za-z0-9]/.test(p)) n++;
  const labels = ["Weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-primary-500"];
  return { n, label: labels[n], color: colors[n] };
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", rePassword: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const st = strength(form.password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = "Name must be at least 3 characters";
    if (!emailRe.test(form.email)) errs.email = "Enter a valid email";
    if (!passRe.test(form.password)) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.rePassword) errs.rePassword = "Passwords do not match";
    if (!phoneRe.test(form.phone)) errs.phone = "Enter a valid Egyptian phone number";
    if (!agree) errs.agree = "You must accept the terms to continue";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await signUp(form);
      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full items-start gap-[60px] py-6 lg:grid-cols-2">
      {/* left: welcome */}
      <div className="hidden lg:block">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to <span className="text-primary-600">FreshCart</span>
        </h1>
        <p className="mt-3 text-xl text-gray-700">
          Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.
        </p>

        <ul className="mt-8 space-y-9">
          {features.map((f) => (
            <li key={f.title} className="flex items-center gap-5">
              <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl text-primary-600">
                <FontAwesomeIcon icon={f.icon} />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{f.title}</h3>
                <p className="text-base text-gray-700">{f.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 w-full rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 60 60" className="h-[60px] w-[60px] shrink-0 rounded-full" aria-hidden>
              <rect width="60" height="60" fill="#4ade80" />
              <path d="M10 60c2-14 12-18 20-18s18 4 20 18z" fill="#dc2626" />
              <rect x="26" y="34" width="8" height="9" fill="#e8b48a" />
              <ellipse cx="30" cy="26" rx="10" ry="12" fill="#f1c9a5" />
              <path d="M19 26c-2-14 8-17 12-16 8 0 12 6 10 16-1-7-5-10-11-10-5 0-9 3-11 10z" fill="#3b2314" />
            </svg>
            <div>
              <p className="font-semibold text-gray-800">Sarah Johnson</p>
              <div className="text-yellow-400">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FontAwesomeIcon key={n} icon={faStar} className="text-sm" />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 italic text-gray-700">
            &quot;FreshCart has transformed my shopping experience. The quality of the products is
            outstanding, and the delivery is always on time. Highly recommend!&quot;
          </p>
        </div>
      </div>

      {/* right: form */}
      <div className="w-full rounded-xl bg-white p-8 shadow-sm">
        <h2 className="text-center text-3xl font-bold text-gray-800">Create Your Account</h2>
        <p className="mb-6 mt-2 text-center text-gray-600">Start your fresh journey with us today</p>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 h-[52px] font-medium hover:bg-gray-50">
            <FontAwesomeIcon icon={faGoogle} className="text-red-600" /> Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 h-[52px] font-medium hover:bg-gray-50">
            <FontAwesomeIcon icon={faFacebook} className="text-blue-600" /> Facebook
          </button>
        </div>

        <div className="my-8 flex items-center gap-4 text-gray-500">
          <span className="h-px flex-1 bg-gray-200" /> or <span className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={submit} className="space-y-9" noValidate>
          <Field label="Name*" placeholder="Ali" value={form.name} onChange={set("name")} error={errors.name} />
          <Field label="Email*" type="email" placeholder="ali@example.com" value={form.email} onChange={set("email")} error={errors.email} />
          <div>
            <Field label="Password*" type="password" placeholder="create a strong password" value={form.password} onChange={set("password")} error={errors.password} />
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div className={`h-full rounded-full transition-all ${st.color}`} style={{ width: `${(st.n / 4) * 100}%` }} />
              </div>
              <span className="text-sm text-gray-600">{form.password ? st.label : "Weak"}</span>
            </div>
            <p className="mt-1 text-xs text-primary-600">Must be at least 8 characters with numbers and symbols</p>
          </div>
          <Field label="Confirm Password*" type="password" placeholder="confirm your password" value={form.rePassword} onChange={set("rePassword")} error={errors.rePassword} />
          <Field label="Phone Number*" type="tel" placeholder="01xxxxxxxxx" value={form.phone} onChange={set("phone")} error={errors.phone} />

          <div>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-primary-600" />
              <span>
                I agree to the <Link href="#" className="text-primary-600 hover:underline">Terms of Service</Link> and{" "}
                <Link href="#" className="text-primary-600 hover:underline">Privacy Policy</Link> *
              </span>
            </label>
            {errors.agree && <span className="mt-1 block text-xs text-red-600">{errors.agree}</span>}
          </div>

          <SubmitButton loading={loading}>Create My Account</SubmitButton>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
