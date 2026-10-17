"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/types";
import { Spinner } from "./ui";

export function SectionTitle({ children, big = false }: { children: React.ReactNode; big?: boolean }) {
  return (
    <div data-reveal="0" className="my-8 flex items-center gap-3">
      <div className="h-8 w-1.5 rounded-full bg-linear-to-b from-emerald-500 to-emerald-700" />
      <h2 className={`${big ? "text-3xl" : "text-2xl md:text-3xl"} font-bold text-gray-800`}>{children}</h2>
    </div>
  );
}

export default function HomeCategories() {
  const [cats, setCats] = useState<Category[] | null>(null);

  useEffect(() => {
    getCategories().then(setCats).catch(() => setCats([]));
  }, []);

  return (
    <section className="py-10">
      <div className="container mx-auto px-5">
        <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
          <SectionTitle>
            Shop By <span className="text-emerald-600">Category</span>
          </SectionTitle>
          <Link
            href="/categories"
            className="flex cursor-pointer items-center self-end font-medium text-primary-600 hover:text-primary-700 sm:self-auto"
          >
            View All Categories
            <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-sm" />
          </Link>
        </div>

        {!cats ? (
          <Spinner label="Loading categories..." />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {cats.map((c, i) => (
              <Link
                key={c._id}
                href={`/categories/${c._id}`}
                data-reveal={String(i % 6)}
                className="group cursor-pointer rounded-lg bg-white p-4 text-center shadow-sm transition hover:shadow-md"
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
    </section>
  );
}
