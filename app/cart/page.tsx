"use client";

import { faArrowLeft, faCheck, faMinus, faPlus, faShieldHalved, faTrashCan, faCartShopping, faTruck, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useAuth, useCart } from "@/components/Providers";
import { emptyIcons, IconEmpty, Spinner } from "@/components/ui";

export default function CartPage() {
  const { token, ready } = useAuth();
  const { cart, loading, update, remove, clear } = useCart();

  if (!ready || (loading && !cart)) return <Spinner label="Loading your cart..." />;
  if (!cart || cart.products.length === 0)
    return (
      <IconEmpty
        icon={emptyIcons.cart}
        title="Your cart is empty"
        text="Looks like you haven't added anything to your cart yet. Start exploring our products!"
        cta="Start Shopping"
        ctaHref="/products"
        showSignIn={!token}
      />
    );

  const n = cart.products.reduce((s, p) => s + p.count, 0);
  const free = cart.totalCartPrice >= 500;

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">Home</Link> / <span className="font-medium text-gray-900">Cart</span>
      </nav>
      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 text-2xl text-white shadow-lg">
          <FontAwesomeIcon icon={faCartShopping} />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">You have <span className="font-semibold text-primary-600">{n} items</span> in your cart</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {cart.products.map((item) => {
            const pid = item.product._id ?? item.product.id ?? "";
            return (
              <div key={item._id} className="flex flex-wrap items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <Link href={`/products/${pid}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.product.imageCover} alt={item.product.title} className="h-28 w-28 rounded-xl bg-gray-50 object-contain" />
                </Link>
                <div className="min-w-48 flex-1">
                  <Link href={`/products/${pid}`} className="font-semibold text-gray-900 hover:text-primary-600">{item.product.title}</Link>
                  {item.product.category?.name && (
                    <span className="mt-1 block w-fit rounded-full bg-primary-50 px-3 py-0.5 text-xs text-primary-700">{item.product.category.name}</span>
                  )}
                  <p className="mt-2 font-semibold text-primary-600">{item.price} EGP <span className="text-sm font-normal text-gray-400">per unit</span></p>
                  <div className="mt-3 inline-flex items-center overflow-hidden rounded-lg border border-gray-200">
                    <button onClick={() => update(pid, item.count - 1)} className="px-3 py-2 text-primary-600 hover:bg-gray-50" aria-label="Decrease"><FontAwesomeIcon icon={faMinus} className="text-xs" /></button>
                    <span className="min-w-10 text-center font-medium">{item.count}</span>
                    <button onClick={() => update(pid, item.count + 1)} className="px-3 py-2 text-primary-600 hover:bg-gray-50" aria-label="Increase"><FontAwesomeIcon icon={faPlus} className="text-xs" /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-gray-900">{item.price * item.count} <span className="text-sm font-medium">EGP</span></p>
                  <button onClick={() => remove(pid)} className="mt-3 text-red-500 hover:text-red-600" aria-label="Remove"><FontAwesomeIcon icon={faTrashCan} /></button>
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between pt-2">
            <Link href="/products" className="text-primary-600 hover:underline"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Continue Shopping</Link>
            <button onClick={clear} className="text-red-500 hover:underline"><FontAwesomeIcon icon={faTrashCan} className="mr-2" />Clear all items</button>
          </div>
        </div>

        <aside className="h-fit overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gray-900 px-6 py-5 text-white">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <p className="text-sm text-gray-300">{n} items in your cart</p>
          </div>
          <div className="space-y-4 p-6">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">{cart.totalCartPrice} EGP</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium text-primary-600">{free ? "FREE" : "Calculated at checkout"}</span></div>
            <div className="flex justify-between border-t pt-4 text-lg font-bold"><span>Total</span><span className="text-primary-600">{cart.totalCartPrice} EGP</span></div>
            <Link href={token ? "/checkout" : "/login"} className="block rounded-xl bg-primary-600 py-4 text-center font-semibold text-white hover:bg-primary-700">
              {token ? "Proceed to Checkout" : "Login to Checkout"}
            </Link>
            {!token && (
              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account? <Link href="/signup" className="font-medium text-primary-600 hover:underline"><FontAwesomeIcon icon={faUserPlus} className="mr-1" />Sign up</Link>
              </p>
            )}
            <ul className="space-y-2 pt-2 text-sm text-gray-600">
              <li><FontAwesomeIcon icon={faCheck} className="mr-2 text-primary-600" />Your cart items will be saved</li>
              <li><FontAwesomeIcon icon={faShieldHalved} className="mr-2 text-primary-600" />Secure checkout</li>
              <li><FontAwesomeIcon icon={faTruck} className="mr-2 text-primary-600" />Fast delivery</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
