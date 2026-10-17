"use client";

import {
  faArrowLeft,
  faCheck,
  faEnvelope,
  faEye,
  faEyeSlash,
  faKey,
  faLock,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { emailRe, passRe } from "@/components/Field";
import { errorMessage, forgotPassword, resetPassword, verifyResetCode } from "@/lib/api";

type Step = 0 | 1 | 2;

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-12 outline-none placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
const btn =
  "w-full rounded-xl bg-primary-600 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 disabled:opacity-60";

function PwField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-2 block font-medium text-gray-800">{label}</label>
      <div className="relative">
        <FontAwesomeIcon icon={faLock} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type={show ? "text" : "password"} className={inputCls} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Toggle password">
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
        </button>
      </div>
    </div>
  );
}

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!emailRe.test(email)) return toast.error("Enter a valid email");
    run(async () => {
      await forgotPassword(email);
      toast.success("Reset code sent to your email");
      setStep(1);
    });
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 6) return toast.error("Enter the 6-digit code");
    run(async () => {
      await verifyResetCode(code.trim());
      toast.success("Code verified!");
      setStep(2);
    });
  };

  const reset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passRe.test(pw)) return toast.error("Password must be at least 6 characters");
    if (pw !== pw2) return toast.error("Passwords do not match");
    run(async () => {
      await resetPassword(email, pw);
      toast.success("Password updated. Please sign in.");
      router.push("/login");
    });
  };

  const titles = [
    ["Forgot Password?", "No worries, we'll send you a reset code"],
    ["Check Your Email", `Enter the 6-digit code sent to ${email}`],
    ["Create New Password", "Your new password must be different from previous passwords"],
  ];
  const icons = [faEnvelope, faKey, faLock];

  return (
    <div className="grid w-full items-center gap-[60px] py-10 lg:grid-cols-2">
      <div>
        <div className="relative flex h-[480px] items-center justify-center overflow-hidden rounded-3xl bg-primary-50 shadow-sm">
          <span className="absolute left-10 top-10 h-28 w-28 rounded-full bg-primary-100/70" />
          <span className="absolute right-16 top-24 h-20 w-20 rounded-full bg-primary-100/70" />
          <span className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-primary-100/70" />
          <div className="relative flex items-center gap-2">
            <span className="flex h-16 w-16 -rotate-12 items-center justify-center rounded-2xl bg-white text-2xl text-primary-500 shadow-lg"><FontAwesomeIcon icon={faEnvelope} /></span>
            <span className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-xl">
              <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary-100 text-4xl text-primary-600"><FontAwesomeIcon icon={faLock} /></span>
            </span>
            <span className="flex h-16 w-16 rotate-12 items-center justify-center rounded-2xl bg-white text-2xl text-primary-500 shadow-lg"><FontAwesomeIcon icon={faShieldHalved} /></span>
          </div>
          <div className="absolute bottom-24 flex gap-3">
            {[0, 1, 2].map((i) => <span key={i} className={`h-3 w-3 rounded-full ${i === step ? "bg-primary-500" : "bg-primary-200"}`} />)}
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-bold text-gray-900">Reset Your Password</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-xl text-gray-700">Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back into your account in no time.</p>
        <div className="mt-5 flex justify-center gap-8 text-gray-700">
          <span><FontAwesomeIcon icon={faEnvelope} className="mr-2 text-primary-600" />Email Verification</span>
          <span><FontAwesomeIcon icon={faShieldHalved} className="mr-2 text-primary-600" />Secure Reset</span>
          <span><FontAwesomeIcon icon={faLock} className="mr-2 text-primary-600" />Encrypted</span>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-10 shadow-lg">
        <h1 className="text-center text-4xl font-bold"><span className="text-primary-600">Fresh</span>Cart</h1>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">{titles[step][0]}</h2>
        <p className="mt-2 text-center text-lg text-gray-700">{titles[step][1]}</p>

        <div className="my-8 flex items-center justify-center">
          {icons.map((ic, i) => (
            <div key={i} className="flex items-center">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full text-sm ${i <= step ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400"} ${i === step ? "ring-4 ring-primary-100" : ""}`}>
                <FontAwesomeIcon icon={i < step ? faCheck : ic} />
              </span>
              {i < 2 && <span className={`h-0.5 w-20 ${i < step ? "bg-primary-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <form onSubmit={send} className="space-y-6" noValidate>
            <div>
              <label className="mb-2 block font-medium text-gray-800">Email Address</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" className={inputCls} placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <button disabled={loading} className={btn}>{loading ? "Please wait..." : "Send Reset Code"}</button>
            <Link href="/login" className="block text-center text-primary-600 hover:underline"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Back to Sign In</Link>
            <p className="border-t pt-6 text-center text-lg text-gray-700">Remember your password? <Link href="/login" className="font-semibold text-primary-600">Sign In</Link></p>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={verify} className="space-y-6" noValidate>
            <div>
              <label className="mb-2 block font-medium text-gray-800">Verification Code</label>
              <div className="relative">
                <FontAwesomeIcon icon={faShieldHalved} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input inputMode="numeric" maxLength={6} className={`${inputCls} text-center tracking-[0.6em]`} placeholder="••••••" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
              </div>
            </div>
            <p className="text-center text-gray-700">Didn&apos;t receive the code? <button type="button" onClick={() => send()} className="font-semibold text-primary-600">Resend Code</button></p>
            <button disabled={loading} className={btn}>{loading ? "Please wait..." : "Verify Code"}</button>
            <button type="button" onClick={() => setStep(0)} className="block w-full text-center text-gray-600 hover:text-primary-600"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Change email address</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={reset} className="space-y-6" noValidate>
            <PwField label="New Password" placeholder="Enter new password" value={pw} onChange={setPw} />
            <PwField label="Confirm Password" placeholder="Confirm new password" value={pw2} onChange={setPw2} />
            <button disabled={loading} className={btn}>{loading ? "Please wait..." : "Reset Password"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
