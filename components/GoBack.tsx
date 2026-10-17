"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function GoBack({ children, className }: { children: ReactNode; className?: string }) {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.back()} className={className}>
      {children}
    </button>
  );
}
