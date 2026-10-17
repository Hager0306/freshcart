"use client";

import { faCcAmex, faCcMastercard, faCcVisa } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowLeft,
  faArrowRight,
  faBagShopping,
  faCheck,
  faCreditCard,
  faHouse,
  faLocationDot,
  faLock,
  faMoneyBillWave,
  faPhone,
  faRotateLeft,
  faShieldHalved,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { phoneRe } from "@/components/Field";
import { useCart } from "@/components/Providers";
import { EmptyState, RequireAuth, Spinner } from "@/components/ui";
import { createCashOrder, createCheckoutSession, errorMessage } from "@/lib/api";

type Method = "cash" | "card";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 outline-none placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

function SectionHead({ icon, title, sub }: { icon: typeof faHouse; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-4 bg-linear-to-r from-primary-500 to-primary-400 px-6 py-5 text-white">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20"><FontAwesomeIcon icon={icon} /></span>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-white/90">{sub}</p>
      </div>
    </div>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { cart, loading, refresh } = useCart();
  const [method, setMethod] = useState<Method>("cash");
  const [form, setForm] = useState({ details: "", phone: "", city: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (loading && !cart) return <Spinner />;
  if (!cart || cart.products.length === 0)
    return <EmptyState title="Your cart is empty" href="/products" cta="Start shopping" />;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const n = cart.products.reduce((s, p) => s + p.count, 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.details.trim().length < 5) errs.details = "Enter your full address details";
    if (!phoneRe.test(form.phone)) errs.phone = "Enter a valid Egyptian phone number";
    if (form.city.trim().length < 2) errs.city = "Enter your city";
    setErrors(errs);
    if (Object.keys(errs).length || !cart) return;

    setSubmitting(true);
    try {
      if (method === "cash") {
        await createCashOrder(cart._id, form);
        toast.success("Order placed successfully");
        await refresh();
        router.push("/orders");
      } else {
        const res = await createCheckoutSession(cart._id, form, window.location.origin);
        window.location.href = res.session.url;
      }
    } catch (err) {
      toast.error(errorMessage(err));
      setSubmitting(false);
    }
  };

  const Option = ({ v, icon, title, text, extra }: { v: Method; icon: typeof faHouse; title: string; text: string; extra?: React.ReactNode }) => {
    const on = method === v;
    return (
      <button
        type="button"
        onClick={() => setMethod(v)}
        className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition ${on ? "border-primary-500 bg-primary-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
      >
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl ${on ? "bg-linear-to-br from-primary-500 to-primary-600 text-white" : "bg-gray-100 text-gray-500"}`}>
          <FontAwesomeIcon icon={icon} />
        </span>
        <span className="flex-1">
          <span className="block text-lg font-semibold text-gray-900">{title}</span>
          <span className="block text-sm text-gray-600">{text}</span>
          {extra}
        </span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${on ? "border-primary-500 bg-primary-500 text-white" : "border-gray-300"}`}>
          {on && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
        </span>
      </button>
    );
  };

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">Home</Link> / <Link href="/cart" className="hover:text-primary-600">Cart</Link> / <span className="font-medium text-gray-900">Checkout</span>
      </nav>
      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 text-2xl text-white shadow-lg"><FontAwesomeIcon icon={faBagShopping} /></span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
          <p className="text-gray-600">Review your items and complete your purchase</p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <SectionHead icon={faLocationDot} title="Shipping Address" sub="Where should we deliver your order?" />
            <div className="space-y-5 p-6">
              <label className="block font-medium text-gray-700">City
                <input className={`${inputCls} mt-2`} placeholder="Cairo, Alexandria, Giza..." value={form.city} onChange={set("city")} />
                {errors.city && <span className="mt-1 block text-sm font-normal text-red-600">{errors.city}</span>}
              </label>
              <label className="block font-medium text-gray-700">Street Address
                <input className={`${inputCls} mt-2`} placeholder="Street name, building number, floor, apartment..." value={form.details} onChange={set("details")} />
                {errors.details && <span className="mt-1 block text-sm font-normal text-red-600">{errors.details}</span>}
              </label>
              <label className="block font-medium text-gray-700">Phone Number
                <span className="relative mt-2 block">
                  <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" className={`${inputCls} pl-11`} placeholder="01xxxxxxxxx" value={form.phone} onChange={set("phone")} />
                </span>
                <span className="mt-1 block text-sm font-normal text-gray-500">Egyptian phone numbers only</span>
                {errors.phone && <span className="block text-sm font-normal text-red-600">{errors.phone}</span>}
              </label>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <SectionHead icon={faCreditCard} title="Payment Method" sub="Choose how you'd like to pay" />
            <div className="space-y-4 p-6">
              <Option v="cash" icon={faMoneyBillWave} title="Cash on Delivery" text="Pay when your order arrives at your doorstep" />
              <Option
                v="card"
                icon={faCreditCard}
                title="Pay Online"
                text="Secure payment with Credit/Debit Card via Stripe"
                extra={
                  <span className="mt-2 flex gap-2 text-2xl text-gray-500">
                    <FontAwesomeIcon icon={faCcVisa} /><FontAwesomeIcon icon={faCcMastercard} /><FontAwesomeIcon icon={faCcAmex} />
                  </span>
                }
              />
              <div className="flex items-center gap-4 rounded-2xl border border-primary-100 bg-primary-50 p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-600"><FontAwesomeIcon icon={faShieldHalved} /></span>
                <div>
                  <p className="font-semibold text-gray-900">Secure &amp; Encrypted</p>
                  <p className="text-sm text-gray-600">Your payment information is protected with industry-standard encryption.</p>
                </div>
              </div>
            </div>
          </section>

          <Link href="/cart" className="inline-block text-primary-600 hover:underline"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Back to Cart</Link>
        </div>

        <aside className="h-fit overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between bg-linear-to-r from-primary-500 to-primary-400 px-6 py-5 text-white">
            <h2 className="text-xl font-semibold"><FontAwesomeIcon icon={faBagShopping} className="mr-2" />Order Summary</h2>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm">{n} items</span>
          </div>
          <div className="space-y-5 p-6">
            <ul className="max-h-60 space-y-3 overflow-y-auto pr-1">
              {cart.products.map((i) => (
                <li key={i._id} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.product.imageCover} alt="" className="h-14 w-14 rounded-lg bg-gray-50 object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{i.product.title}</p>
                    <p className="text-xs text-gray-500">{i.count} × {i.price} EGP</p>
                  </div>
                  <span className="text-sm font-semibold">{i.count * i.price} EGP</span>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium text-gray-900">{cart.totalCartPrice} EGP</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="font-semibold text-primary-600">FREE</span></div>
              <div className="flex items-end justify-between border-t pt-4"><span className="text-lg font-bold">Total</span><span className="text-3xl font-bold text-primary-600">{cart.totalCartPrice} EGP</span></div>
            </div>
            <button disabled={submitting} className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary-600 py-4 text-lg font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
              {submitting ? "Please wait..." : method === "cash" ? <>Place Order <FontAwesomeIcon icon={faCheck} /></> : <>Proceed to Payment <FontAwesomeIcon icon={faArrowRight} /></>}
            </button>
            <div className="grid grid-cols-3 gap-2 border-t pt-4 text-center text-xs text-gray-600">
              <span><FontAwesomeIcon icon={faLock} className="mb-1 block w-full text-primary-600" />Secure</span>
              <span><FontAwesomeIcon icon={faTruckFast} className="mb-1 block w-full text-primary-600" />Fast Delivery</span>
              <span><FontAwesomeIcon icon={faRotateLeft} className="mb-1 block w-full text-primary-600" />Easy Returns</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutContent />
    </RequireAuth>
  );
}
