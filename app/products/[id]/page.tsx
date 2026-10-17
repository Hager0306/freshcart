"use client";

import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faBolt,
  faCartShopping,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faHeart,
  faHouse,
  faMinus,
  faPlus,
  faRotateLeft,
  faShareNodes,
  faShieldHalved,
  faStar,
  faTruck,
  faTruckFast,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ProductCard, { Stars } from "@/components/ProductCard";
import { useAuth, useCart, useWishlist } from "@/components/Providers";
import { ErrorState, Spinner } from "@/components/ui";
import { errorMessage, getProduct, getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

type Tab = "details" | "reviews" | "shipping";

export default function ProductDetailsPage({ params }: PageProps<"/products/[id]">) {
  const { id } = use(params);
  const router = useRouter();
  const { token } = useAuth();
  const { cart, add, update } = useCart();
  const wish = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [img, setImg] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("details");
  const [related, setRelated] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setProduct(null);
    setError(null);
    setQty(1);
    setTab("details");
    getProduct(id)
      .then((p) => {
        if (cancelled) return;
        setProduct(p);
        setImg(p.imageCover);
        getProducts({ category: p.category?._id, limit: 12 })
          .then((r) => !cancelled && setRelated(r.data.filter((x) => x._id !== p._id).slice(0, 10)))
          .catch(() => {});
      })
      .catch((e) => !cancelled && setError(errorMessage(e)));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!product) return <Spinner />;

  const pid = product._id;
  const liked = wish.ids.has(pid);
  const gallery = [product.imageCover, ...(product.images ?? []).filter((g) => g !== product.imageCover)];
  const price = product.priceAfterDiscount ?? product.price;
  const hasDiscount = product.priceAfterDiscount != null && product.priceAfterDiscount < product.price;
  const inStock = product.quantity > 0;
  const sub = product.subcategory?.[0];

  const addToCart = async () => {
    const existing = cart?.products.find((p) => (p.product._id ?? p.product.id) === pid)?.count ?? 0;
    await add(pid);
    if (qty > 1) await update(pid, existing + qty);
  };

  const onAdd = async () => {
    setBusy(true);
    await addToCart();
    setBusy(false);
  };

  const onBuy = async () => {
    setBusy(true);
    await addToCart();
    setBusy(false);
    router.push(token ? "/checkout" : "/login");
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const scrollRail = (dir: number) =>
    rail.current?.scrollBy({ left: dir * rail.current.clientWidth, behavior: "smooth" });

  const tabBtn = (t: Tab, label: string, icon: typeof faBox) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      className={`flex items-center gap-3 border-b-2 px-8 py-5 text-lg font-medium transition ${
        tab === t ? "border-primary-600 bg-primary-50/50 text-primary-600" : "border-transparent text-gray-600 hover:text-primary-600"
      }`}
    >
      <FontAwesomeIcon icon={icon} />
      {label}
    </button>
  );

  return (
    <div className="container mx-auto px-5">
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-4 py-6 text-lg text-gray-600">
        <Link href="/" className="hover:text-primary-600"><FontAwesomeIcon icon={faHouse} className="mr-2 text-gray-500" />Home</Link>
        <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-400" />
        {product.category && (
          <>
            <Link href={`/products?category=${product.category._id}`} className="hover:text-primary-600">{product.category.name}</Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-400" />
          </>
        )}
        {sub && (
          <>
            <Link href={`/products?subcategory=${sub._id}`} className="hover:text-primary-600">{sub.name}</Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-400" />
          </>
        )}
        <span className="font-medium text-gray-900">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)]">
        {/* gallery */}
        <div className="h-fit overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-[520px] items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={product.title} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
            {gallery.map((g) => (
              <button
                key={g}
                onClick={() => setImg(g)}
                className={`h-[105px] w-[105px] shrink-0 overflow-hidden border-2 bg-white p-1 ${img === g ? "border-blue-500" : "border-transparent"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {product.category && (
              <Link href={`/products?category=${product.category._id}`} className="rounded-full bg-primary-50 px-4 py-2 text-primary-700">{product.category.name}</Link>
            )}
            {product.brand && (
              <Link href={`/products?brand=${product.brand._id}`} className="rounded-full bg-gray-100 px-4 py-2 text-gray-700">{product.brand.name}</Link>
            )}
          </div>

          <h1 className="mt-5 text-5xl font-bold tracking-tight text-gray-900">{product.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-lg text-gray-700">
            <Stars value={product.ratingsAverage} />
            <span>{product.ratingsAverage} ({product.ratingsQuantity} reviews)</span>
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-5xl font-bold text-gray-900">{price} EGP</span>
            {hasDiscount && <span className="text-2xl text-gray-400 line-through">{product.price} EGP</span>}
          </div>

          <span className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium ${inStock ? "bg-primary-50 text-primary-700" : "bg-red-50 text-red-600"}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${inStock ? "bg-primary-500" : "bg-red-500"}`} />
            {inStock ? "In Stock" : "Out of Stock"}
          </span>

          <hr className="my-8 border-gray-100" />
          <p className="text-xl leading-relaxed text-gray-700">{product.description}</p>

          <p className="mt-8 text-lg text-gray-700">Quantity</p>
          <div className="mt-3 flex items-center gap-6">
            <div className="flex items-center rounded-xl border-2 border-gray-200">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-5 py-4 text-gray-700 hover:text-primary-600" aria-label="Decrease"><FontAwesomeIcon icon={faMinus} /></button>
              <span className="w-12 text-center text-xl font-medium">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.quantity || 1, q + 1))} className="px-5 py-4 text-gray-700 hover:text-primary-600" aria-label="Increase"><FontAwesomeIcon icon={faPlus} /></button>
            </div>
            <span className="text-lg text-gray-600">{product.quantity} available</span>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-2xl bg-gray-50 px-6 py-6">
            <span className="text-xl text-gray-700">Total Price:</span>
            <span className="text-4xl font-bold text-primary-600">{(price * qty).toFixed(2)} EGP</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button disabled={!inStock || busy} onClick={onAdd} className="rounded-xl bg-primary-600 py-5 text-xl font-semibold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 disabled:opacity-60">
              <FontAwesomeIcon icon={faCartShopping} className="mr-3" />Add to Cart
            </button>
            <button disabled={!inStock || busy} onClick={onBuy} className="rounded-xl bg-gray-900 py-5 text-xl font-semibold text-white hover:bg-black disabled:opacity-60">
              <FontAwesomeIcon icon={faBolt} className="mr-3" />Buy Now
            </button>
          </div>

          <div className="mt-4 flex gap-4">
            <button onClick={() => wish.toggle(pid)} className="flex-1 rounded-xl border-2 border-gray-200 py-4 text-xl font-medium text-gray-800 hover:border-primary-500 hover:text-primary-600">
              <FontAwesomeIcon icon={liked ? faHeart : faHeartRegular} className={`mr-3 ${liked ? "text-red-500" : ""}`} />
              {liked ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
            <button onClick={share} aria-label="Share" className="flex h-[66px] w-[66px] items-center justify-center rounded-xl border-2 border-gray-200 text-gray-800 hover:border-primary-500 hover:text-primary-600">
              <FontAwesomeIcon icon={faShareNodes} />
            </button>
          </div>

          <hr className="my-8 border-gray-100" />
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              [faTruckFast, "Free Delivery", "Orders over $50"],
              [faRotateLeft, "30 Days Return", "Money back"],
              [faShieldHalved, "Secure Payment", "100% Protected"],
            ].map(([ic, t, d]) => (
              <div key={t as string} className="flex items-center gap-4">
                <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary-100 text-primary-600"><FontAwesomeIcon icon={ic as typeof faTruck} /></span>
                <div>
                  <p className="text-lg font-medium text-gray-900">{t as string}</p>
                  <p className="text-gray-600">{d as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tabs */}
      <section className="mt-16 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap border-b border-gray-100">
          {tabBtn("details", "Product Details", faBox)}
          {tabBtn("reviews", `Reviews (${product.ratingsQuantity})`, faStar)}
          {tabBtn("shipping", "Shipping & Returns", faTruck)}
        </div>
        <div className="p-8">
          {tab === "details" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900">About this Product</h2>
              <p className="mt-4 text-xl text-gray-700">{product.description}</p>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">Product Information</h3>
                  {[
                    ["Category", product.category?.name],
                    ["Subcategory", sub?.name],
                    ["Brand", product.brand?.name],
                    ["Items Sold", `${product.sold ?? 0}+ sold`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 text-lg">
                      <span className="text-gray-600">{k}</span>
                      <span className="text-gray-900">{v ?? "-"}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-gray-50 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">Key Features</h3>
                  {["Premium Quality Product", "100% Authentic Guarantee", "Fast & Secure Packaging", "Quality Tested"].map((f) => (
                    <p key={f} className="py-1.5 text-lg text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="mr-3 text-primary-600" />{f}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          {tab === "reviews" && (
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-6xl font-bold text-gray-900">{product.ratingsAverage}</p>
                <Stars value={product.ratingsAverage} />
                <p className="mt-1 text-gray-600">{product.ratingsQuantity} reviews</p>
              </div>
              <p className="text-lg text-gray-600">Customer reviews are based on {product.ratingsQuantity} verified purchases.</p>
            </div>
          )}
          {tab === "shipping" && (
            <div className="grid gap-6 text-lg text-gray-700 md:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Shipping Information</h3>
                <p>Free delivery on orders over 500 EGP. Standard delivery takes 2-5 business days.</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Returns &amp; Refunds</h3>
                <p>Easy returns within 14 days of delivery. Products must be unused and in original packaging.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-16 pb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="border-l-4 border-primary-600 pl-4 text-3xl font-bold text-gray-900">
              You May Also <span className="text-primary-600">Like</span>
            </h2>
            <div className="flex gap-3">
              <button onClick={() => scrollRail(-1)} aria-label="Previous" className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"><FontAwesomeIcon icon={faChevronLeft} /></button>
              <button onClick={() => scrollRail(1)} aria-label="Next" className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
          </div>
          <div ref={rail} className="grid snap-x auto-cols-[calc((100%-6rem)/5)] grid-flow-col gap-6 overflow-x-auto pb-4 max-lg:auto-cols-[70%]">
            {related.map((p) => (
              <div key={p._id} className="snap-start"><ProductCard product={p} /></div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
