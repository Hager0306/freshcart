"use client";

import {
  faArrowRightArrowLeft,
  faEye,
  faHeart,
  faPlus,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart, useWishlist } from "./Providers";

export function Stars({ value }: { value: number }) {
  return (
    <div className="mr-2 flex text-amber-400">
      <div className="text-yellow-400">
        {[1, 2, 3, 4, 5].map((n) => {
          if (value >= n - 0.25) return <FontAwesomeIcon key={n} icon={faStar} className="text-sm" />;
          if (value >= n - 0.75) return <FontAwesomeIcon key={n} icon={faStarHalfStroke} className="text-sm" />;
          return <FontAwesomeIcon key={n} icon={faStar} className="text-sm text-gray-300" />;
        })}
      </div>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const wish = useWishlist();
  const [adding, setAdding] = useState(false);
  const id = product._id ?? product.id ?? "";
  const liked = wish.ids.has(id);
  const hasDiscount = Boolean(product.priceAfterDiscount && product.priceAfterDiscount < product.price);
  const discount = hasDiscount
    ? Math.round(((product.price - (product.priceAfterDiscount as number)) / product.price) * 100)
    : 0;

  return (
    <div data-reveal="0" className="lift overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.imageCover} alt={product.title} className="h-60 w-full bg-white object-contain" loading="lazy" />

        {hasDiscount && (
          <div className="absolute left-3 top-3">
            <span className="rounded bg-red-500 px-2 py-1 text-xs text-white">-{discount}%</span>
          </div>
        )}

        <div className="absolute right-3 top-3 flex flex-col space-y-2">
          <button
            onClick={() => wish.toggle(id)}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition ${
              liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          >
            <FontAwesomeIcon icon={liked ? faHeart : faHeartRegular} className="text-sm" />
          </button>
          <button
            aria-label="Compare"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:text-primary-600"
          >
            <FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-sm" />
          </button>
          <Link
            href={`/products/${id}`}
            aria-label="View product"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:text-primary-600"
          >
            <FontAwesomeIcon icon={faEye} className="text-sm" />
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1 text-xs text-gray-500">{product.category?.name}</div>
        <h3 className="mb-1 cursor-pointer font-medium">
          <Link href={`/products/${id}`} className="line-clamp-2">
            {product.title}
          </Link>
        </h3>
        <div className="mb-2 flex items-center">
          <Stars value={product.ratingsAverage} />
          <span className="text-xs text-gray-500">
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-primary-600">{product.priceAfterDiscount} EGP</span>
                <span className="ml-2 text-sm text-gray-500 line-through">{product.price} EGP</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">{product.price} EGP</span>
            )}
          </div>
          <button
            disabled={adding}
            onClick={async () => {
              setAdding(true);
              await add(id);
              setAdding(false);
            }}
            aria-label="Add to cart"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-70"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
    </div>
  );
}
