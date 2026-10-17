"use client";

import { faFilter, faLayerGroup, faTags, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import ProductList from "@/components/ProductList";
import { getBrand, getCategory, getSubCategory } from "@/lib/api";

export default function ProductsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const keyword = params.get("keyword") ?? "";
  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const subcategory = params.get("subcategory") ?? "";

  const [names, setNames] = useState<{ category?: string; brand?: string; subcategory?: string }>({});
  const [catImage, setCatImage] = useState<string | undefined>();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let off = false;
    setNames({});
    setCatImage(undefined);
    if (category)
      getCategory(category)
        .then((c) => {
          if (off) return;
          setNames((n) => ({ ...n, category: c.name }));
          setCatImage(c.image);
        })
        .catch(() => {});
    if (brand)
      getBrand(brand)
        .then((b) => !off && setNames((n) => ({ ...n, brand: b.name })))
        .catch(() => {});
    if (subcategory)
      getSubCategory(subcategory)
        .then((s) => !off && setNames((n) => ({ ...n, subcategory: s.name })))
        .catch(() => {});
    return () => {
      off = true;
    };
  }, [category, brand, subcategory]);

  const remove = (key: string) => {
    const sp = new URLSearchParams(params.toString());
    sp.delete(key);
    const q = sp.toString();
    router.push(q ? `/products?${q}` : "/products");
  };

  // header content depends on the active filter
  let title = "All Products";
  let subtitle = "Explore our complete product collection";
  let crumbs: { label: string; href?: string }[] = [{ label: "Home", href: "/" }, { label: "All Products" }];
  let icon = undefined as undefined | typeof faTags;
  if (category) {
    const n = names.category ?? "Category";
    title = n;
    subtitle = `Browse products in ${n}`;
    crumbs = [{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: n }];
  } else if (brand) {
    const n = names.brand ?? "Brand";
    title = n;
    subtitle = `Browse products from ${n}`;
    crumbs = [{ label: "Home", href: "/" }, { label: "Brands", href: "/brands" }, { label: n }];
    icon = faTags;
  } else if (subcategory) {
    const n = names.subcategory ?? "Subcategory";
    title = n;
    subtitle = `Browse products in ${n}`;
    crumbs = [{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: n }];
  } else if (keyword) {
    title = "Search Results";
    subtitle = `Results for “${keyword}”`;
    crumbs = [{ label: "Home", href: "/" }, { label: "Search" }];
  }

  const chips: { key: string; label: string; icon: typeof faLayerGroup }[] = [];
  if (category) chips.push({ key: "category", label: names.category ?? "Category", icon: faLayerGroup });
  if (brand) chips.push({ key: "brand", label: names.brand ?? "Brand", icon: faTags });
  if (subcategory) chips.push({ key: "subcategory", label: names.subcategory ?? "Subcategory", icon: faLayerGroup });
  if (keyword) chips.push({ key: "keyword", label: `“${keyword}”`, icon: faFilter });

  return (
    <>
      <PageHeader crumbs={crumbs} title={title} subtitle={subtitle} image={catImage} icon={icon} />

      <div className="container mx-auto px-5 py-8">
        {chips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-2 text-gray-700">
              <FontAwesomeIcon icon={faFilter} /> Active Filters:
            </span>
            {chips.map((c) => (
              <span
                key={c.key}
                className="flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 font-medium text-primary-700"
              >
                <FontAwesomeIcon icon={c.icon} className="text-xs" />
                {c.label}
                <button onClick={() => remove(c.key)} aria-label={`Remove ${c.label} filter`} className="hover:text-primary-900">
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>
              </span>
            ))}
            <Link href="/products" className="text-gray-600 underline hover:text-primary-600">
              Clear all
            </Link>
          </div>
        )}

        {count !== null && <p className="mb-6 text-sm text-gray-600">Showing {count} products</p>}

        <ProductList
          limit={100}
          onLoaded={setCount}
          query={{
            keyword: keyword || undefined,
            category: category || undefined,
            brand: brand || undefined,
            subcategory: subcategory || undefined,
          }}
        />
      </div>
    </>
  );
}
