"use client";

import {
  faBagShopping,
  faBox,
  faCalendar,
  faChevronDown,
  faClock,
  faCircleCheck,
  faLocationDot,
  faMoneyBillWave,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/Providers";
import { EmptyState, ErrorState, RequireAuth, Spinner } from "@/components/ui";
import { errorMessage, getUserOrders } from "@/lib/api";
import type { Order } from "@/lib/types";

function OrderCard({ o }: { o: Order }) {
  const [open, setOpen] = useState(false);
  const first = o.cartItems[0]?.product;
  const items = o.cartItems.reduce((n, i) => n + i.count, 0);
  const extra = o.cartItems.length - 1;
  const done = o.isDelivered;
  const date = new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-5">
        <div className="relative h-[140px] w-[140px] shrink-0 rounded-2xl border border-gray-100 bg-gray-50 p-3">
          {first && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={first.imageCover} alt={first.title} className="h-full w-full object-contain" />
          )}
          {extra > 0 && (
            <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">+{extra}</span>
          )}
        </div>
        <div className="min-w-60 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${done ? "bg-primary-50 text-primary-700" : "bg-amber-50 text-orange-600"}`}>
                <FontAwesomeIcon icon={done ? faCircleCheck : faClock} className="text-xs" />{done ? "Delivered" : "Processing"}
              </span>
              <p className="mt-3 text-2xl font-bold text-gray-900"><span className="mr-2 text-gray-400">#</span>{o.id}</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600" title={o.paymentMethodType}>
              <FontAwesomeIcon icon={o.paymentMethodType === "card" ? faCreditCard : faMoneyBillWave} />
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-gray-600">
            <span><FontAwesomeIcon icon={faCalendar} className="mr-2 text-gray-400" />{date}</span>
            <span className="text-gray-300">•</span>
            <span><FontAwesomeIcon icon={faBox} className="mr-2 text-gray-400" />{items} items</span>
            {o.shippingAddress?.city && (
              <>
                <span className="text-gray-300">•</span>
                <span><FontAwesomeIcon icon={faLocationDot} className="mr-2 text-gray-400" />{o.shippingAddress.city}</span>
              </>
            )}
          </div>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-900">{o.totalOrderPrice.toLocaleString("en-US")} <span className="text-sm font-medium text-gray-500">EGP</span></p>
            <button onClick={() => setOpen((v) => !v)} className="rounded-xl bg-gray-100 px-5 py-3 font-medium text-gray-700 hover:bg-gray-200">
              Details <FontAwesomeIcon icon={faChevronDown} className={`ml-2 text-xs transition ${open ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="mt-6 border-t border-gray-100 pt-6">
          <ul className="grid gap-4 md:grid-cols-2">
            {o.cartItems.map((i) => (
              <li key={i._id} className="flex items-center gap-4 rounded-xl bg-gray-50 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.product.imageCover} alt="" className="h-16 w-16 rounded-lg bg-white object-contain" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{i.product.title}</p>
                  <p className="text-sm text-gray-500">{i.count} × {i.price} EGP</p>
                </div>
                <span className="font-semibold">{i.count * i.price} EGP</span>
              </li>
            ))}
          </ul>
          {o.shippingAddress && (
            <p className="mt-4 text-sm text-gray-600"><FontAwesomeIcon icon={faLocationDot} className="mr-2" />{o.shippingAddress.details}, {o.shippingAddress.city} · {o.shippingAddress.phone}</p>
          )}
        </div>
      )}
    </div>
  );
}

function OrdersContent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    getUserOrders(user.id)
      .then((o) => setOrders([...o].reverse()))
      .catch((e) => setError(errorMessage(e)));
  }, [user?.id]);

  if (error) return <ErrorState message={error} />;
  if (!orders) return <Spinner label="Loading your orders..." />;
  if (orders.length === 0) return <EmptyState title="No orders yet" href="/products" cta="Start shopping" />;

  return (
    <div>
      <nav className="mb-6 text-gray-500"><Link href="/" className="hover:text-primary-600">Home</Link> / <span className="text-gray-900">My Orders</span></nav>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary-600 text-2xl text-white shadow-lg shadow-primary-600/30"><FontAwesomeIcon icon={faBox} /></span>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">Track and manage your {orders.length} order{orders.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        <Link href="/products" className="text-primary-600 hover:underline"><FontAwesomeIcon icon={faBagShopping} className="mr-2" />Continue Shopping</Link>
      </div>
      <div className="space-y-5">{orders.map((o) => <OrderCard key={o._id} o={o} />)}</div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <RequireAuth>
      <OrdersContent />
    </RequireAuth>
  );
}
