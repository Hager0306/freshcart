"use client";

import Link from "next/link";
import { useAuth, useCart, useWishlist } from "@/components/Providers";
import { emptyIcons, IconEmpty, PageTitle, Spinner } from "@/components/ui";

function WishlistContent() {
  const { token, ready } = useAuth();
  const { items, loading, remove } = useWishlist();
  const { add } = useCart();

  if (!ready) return <Spinner />;

  if (loading && items.length === 0) return <Spinner label="Loading your wishlist..." />;
  if (items.length === 0)
    return (
      <IconEmpty
        icon={emptyIcons.heart}
        title="Your wishlist is empty"
        text={
          token
            ? "Browse products and save your favorites here."
            : "Browse products and save your favorites here. Sign in to sync your wishlist across devices."
        }
        cta="Browse Products"
        ctaHref="/products"
        showSignIn={!token}
      />
    );

  return (
    <>
      <PageTitle sub={`${items.length} saved item(s)`}>My wishlist</PageTitle>
      <div className="space-y-3">
        {items.map((p) => {
          const id = p._id ?? p.id ?? "";
          return (
            <div key={id} className="flex flex-col gap-4 rounded-lg border bg-white p-3 sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageCover} alt={p.title} className="h-28 w-28 rounded object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${id}`} className="font-semibold hover:text-green-600">
                    {p.title}
                  </Link>
                  <p className="mt-1 font-bold">{p.priceAfterDiscount ?? p.price} EGP</p>
                </div>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => add(id)}
                    className="rounded bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() => remove(id)}
                    className="rounded border border-red-300 px-4 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function WishlistPage() {
  return (
    <WishlistContent />
  );
}
