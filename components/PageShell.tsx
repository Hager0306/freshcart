"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const under = (p: string, base: string) => p === base || p.startsWith(base + "/");

/** Pages that live inside a padded container. Everything else (home, banner pages, 404…) is full-bleed. */
const CONTAINED = ["/cart", "/checkout", "/login", "/register", "/signup", "/forget-password", "/orders", "/wishlist"];

export default function PageShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const contained = CONTAINED.some((b) => under(pathname, b));
  if (!contained) return <main>{children}</main>;
  return <main className="mx-auto min-h-[60vh] w-full max-w-[1600px] px-5 py-8">{children}</main>;
}
