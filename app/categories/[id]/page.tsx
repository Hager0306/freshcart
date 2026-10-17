"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import ProductList from "@/components/ProductList";
import { ErrorState, Spinner } from "@/components/ui";
import { errorMessage, getCategory, getSubCategoriesOf } from "@/lib/api";
import type { Category, SubCategory } from "@/lib/types";

export default function CategoryPage({ params }: PageProps<"/categories/[id]">) {
  const { id } = use(params);
  const [cat, setCat] = useState<Category | null>(null);
  const [subs, setSubs] = useState<SubCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCat(null);
    setError(null);
    Promise.all([getCategory(id), getSubCategoriesOf(id).catch(() => [] as SubCategory[])])
      .then(([c, s]) => {
        if (cancelled) return;
        setCat(c);
        setSubs(s);
      })
      .catch((e) => !cancelled && setError(errorMessage(e)));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <div className="container mx-auto px-5 py-8"><ErrorState message={error} /></div>;
  if (!cat) return <Spinner />;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: cat.name }]}
        title={cat.name}
        subtitle={`Browse products in ${cat.name}`}
        image={cat.image}
      />
      <div className="container mx-auto px-5 py-8">
        {subs.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">Subcategories</h2>
            <div className="flex flex-wrap gap-2">
              {subs.map((s) => (
                <Link
                  key={s._id}
                  href={`/subcategories/${s._id}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm transition hover:border-primary-500 hover:text-primary-600"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        <ProductList limit={100} query={{ category: id }} emptyTitle={`No products in ${cat.name} yet`} />
      </div>
    </>
  );
}
