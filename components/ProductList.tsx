"use client";

import { useEffect, useState } from "react";
import { errorMessage, getProducts, type ProductQuery } from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { EmptyState, ErrorState, Pagination, Spinner } from "./ui";

/**
 * Fetches and renders a paginated product grid for any filter
 * (category, subcategory, brand, keyword, sort).
 */
export default function ProductList({
  query,
  limit = 12,
  paginate = true,
  emptyTitle = "No products found",
  onLoaded,
}: {
  query: Omit<ProductQuery, "page" | "limit">;
  limit?: number;
  paginate?: boolean;
  emptyTitle?: string;
  onLoaded?: (count: number) => void;
}) {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const key = JSON.stringify(query);

  // reset to the first page whenever the filter changes
  useEffect(() => {
    setPage(1);
  }, [key]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProducts({ ...query, page, limit })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data);
        onLoaded?.(res.results ?? res.data.length);
        setPages(res.metadata?.numberOfPages ?? 1);
      })
      .catch((e) => !cancelled && setError(errorMessage(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, page, limit, tick]);

  if (loading) return <Spinner label="Loading products..." />;
  if (error) return <ErrorState message={error} retry={() => setTick((t) => t + 1)} />;
  if (products.length === 0) return <EmptyState title={emptyTitle} />;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {paginate && (
        <Pagination
          page={page}
          pages={pages}
          onChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}
