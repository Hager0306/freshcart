"use client";

import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
  faClock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faHeadset,
  faLock,
  faShieldHalved,
  faStar,
  faTruckFast,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { emailRe } from "@/components/Field";
import { useAuth } from "@/components/Providers";
import { errorMessage, signIn } from "@/lib/api";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-11 outline-none placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!emailRe.test(email)) errs.email = "Enter a valid email";
    if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await signIn({ email, password });
      login(res.token);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full min-[1640px]:-mx-5 min-[1640px]:w-[calc(100%+40px)] items-center gap-[60px] py-6 lg:grid-cols-2">
      <div className="hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/login-cart.png" alt="Shopping cart full of fresh vegetables" className="h-[480px] w-full rounded-3xl object-cover shadow-lg" />
        <h2 className="mt-8 text-center text-3xl font-bold text-gray-900">FreshCart - Your One-Stop Shop for Fresh Products</h2>
        <p className="mt-3 text-center text-lg text-gray-600">Join thousands of happy customers who trust FreshCart for their daily grocery needs</p>
        <div className="mt-6 flex justify-center gap-6 text-gray-700">
          <span><FontAwesomeIcon icon={faTruckFast} className="mr-2 text-primary-600" />Free Delivery</span>
          <span><FontAwesomeIcon icon={faShieldHalved} className="mr-2 text-primary-600" />Secure Payment</span>
          <span><FontAwesomeIcon icon={faClock} className="mr-2 text-primary-600" />24/7 Support</span>
        </div>
      </div>

      <div className="w-full rounded-2xl bg-white p-10 shadow-sm">
        <h1 className="text-center text-3xl font-bold"><span className="text-primary-600">Fresh</span>Cart</h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Welcome Back!</h2>
        <p className="mb-6 mt-1 text-center text-gray-600">Sign in to continue your fresh shopping experience</p>

        <div className="space-y-3">
          <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 font-medium hover:bg-gray-50">
            <FontAwesomeIcon icon={faGoogle} className="text-red-500" /> Continue with Google
          </button>
          <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 font-medium hover:bg-gray-50">
            <FontAwesomeIcon icon={faFacebook} className="text-blue-600" /> Continue with Facebook
          </button>
        </div>
        <div className="my-6 flex items-center gap-4 text-xs font-semibold tracking-wide text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />OR CONTINUE WITH EMAIL<span className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={submit} className="space-y-5" noValidate>
          <label className="block font-medium text-gray-700">Email Address
            <span className="relative mt-2 block">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" className={inputCls} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </span>
            {errors.email && <span className="mt-1 block text-sm font-normal text-red-600">{errors.email}</span>}
          </label>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="pw" className="font-medium text-gray-700">Password</label>
              <Link href="/forget-password" className="text-sm text-primary-600 hover:underline">Forgot Password?</Link>
            </div>
            <span className="relative mt-2 block">
              <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="pw" type={show ? "text" : "password"} className={inputCls} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Toggle password">
                <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
              </button>
            </span>
            {errors.password && <span className="mt-1 block text-sm text-red-600">{errors.password}</span>}
          </div>
          <label className="flex items-center gap-2 text-gray-700">
            <input type="checkbox" className="h-4 w-4 accent-primary-600" /> Keep me signed in
          </label>
          <button disabled={loading} className="w-full rounded-xl bg-primary-600 py-4 text-lg font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
            {loading ? "Please wait..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 border-t pt-6 text-center text-gray-600">
          New to FreshCart? <Link href="/signup" className="font-medium text-primary-600 hover:underline">Create an account</Link>
        </p>
        <div className="mt-6 flex justify-center gap-8 text-sm text-gray-500">
          <span><FontAwesomeIcon icon={faLock} className="mr-1" />SSL Secured</span>
          <span><FontAwesomeIcon icon={faUsers} className="mr-1" />50K+ Users</span>
          <span><FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-400" />4.9 Rating</span>
        </div>
      </div>
    </div>
  );
}
