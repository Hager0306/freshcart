"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { Spinner } from "@/components/ui";

/** Brand pages live on /products?brand=ID (same as the demo). */
export default function BrandRedirect({ params }: PageProps<"/brands/[id]">) {
  const { id } = use(params);
  const router = useRouter();
  useEffect(() => {
    router.replace(`/products?brand=${id}`);
  }, [id, router]);
  return <Spinner />;
}
