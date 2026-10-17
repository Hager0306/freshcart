"use client";

import { use, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import ProductList from "@/components/ProductList";
import { ErrorState, Spinner } from "@/components/ui";
import { errorMessage, getCategory, getSubCategory } from "@/lib/api";
import type { SubCategory } from "@/lib/types";

export default function SubCategoryPage({ params }: PageProps<"/subcategories/[id]">) {
  const { id } = use(params);
  const [sub, setSub] = useState<SubCategory | null>(null);
  const [catName, setCatName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSub(null);
    setError(null);
    getSubCategory(id)
      .then((s) => {
        if (cancelled) return;
        setSub(s);
        getCategory(s.category)
          .then((c) => !cancelled && setCatName(c.name))
          .catch(() => {});
      })
      .catch((e) => !cancelled && setError(errorMessage(e)));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <div className="container mx-auto px-5 py-8"><ErrorState message={error} /></div>;
  if (!sub) return <Spinner />;

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          ...(catName ? [{ label: catName, href: `/categories/${sub.category}` }] : []),
          { label: sub.name },
        ]}
        title={sub.name}
        subtitle={`Browse products in ${sub.name}`}
      />
      <div className="container mx-auto px-5 py-8">
        <ProductList limit={100} query={{ subcategory: id }} emptyTitle="No products in this subcategory yet" />
      </div>
    </>
  );
}
