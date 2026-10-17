"use client";

import { faTags } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { ErrorState, Spinner } from "@/components/ui";
import { errorMessage, getBrands } from "@/lib/api";
import type { Brand } from "@/lib/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBrands(1, 100)
      .then((r) => setBrands(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, []);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Brands" }]}
        title="Top Brands"
        subtitle="Shop from your favorite brands"
        icon={faTags}
        tone="purple"
      />
      <div className="container mx-auto px-5 py-8">
        {error ? (
          <ErrorState message={error} />
        ) : !brands ? (
          <Spinner label="Loading brands..." />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {brands.map((b, i) => (
              <Link
                key={b._id}
                href={`/products?brand=${b._id}`}
                data-reveal={String(i % 6)}
                className="group lift rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
              >
                <div className="rounded-2xl bg-gray-50 p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt={b.name} className="h-24 w-full bg-white object-contain" loading="lazy" />
                </div>
                <p className="pt-6 pb-10 text-sm font-semibold text-gray-800 group-hover:text-primary-600">{b.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
