"use client";

import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { ErrorState, Spinner } from "@/components/ui";
import { errorMessage, getCategories } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then(setCats).catch((e) => setError(errorMessage(e)));
  }, []);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
        title="All Categories"
        subtitle="Browse our wide range of product categories"
        icon={faLayerGroup}
      />
      <div className="container mx-auto px-5 py-8">
        {error ? (
          <ErrorState message={error} />
        ) : !cats ? (
          <Spinner label="Loading categories..." />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {cats.map((c, i) => (
              <Link
                key={c._id}
                href={`/categories/${c._id}`}
                data-reveal={String(i % 5)}
                className="group rounded-lg bg-white p-4 text-center shadow-sm transition hover:shadow-md"
              >
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-100 transition group-hover:bg-primary-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <h3 className="font-medium">{c.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
