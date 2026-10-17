"use client";

import { faArrowRight, faHeart, faCartShopping, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "./Providers";

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  href,
  cta,
}: {
  title: string;
  hint?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="py-20 text-center">
      <p className="text-lg font-semibold text-gray-800">{title}</p>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      {href && (
        <Link
          href={href}
          className="mt-4 inline-block rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          {cta ?? "Continue"}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="py-16 text-center">
      <p className="font-semibold text-red-600">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="mt-3 rounded border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-50"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function PageTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{children}</h1>
      {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
    </div>
  );
}

export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded border px-3 py-1 text-sm disabled:opacity-40"
      >
        Prev
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-8 w-8 rounded text-sm ${
            p === page ? "bg-green-600 text-white" : "border hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="rounded border px-3 py-1 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

/** Redirects to /login when there is no session. Renders children once logged in. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { token, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !token) router.replace("/login");
  }, [ready, token, router]);

  if (!ready || !token) return <Spinner />;
  return <>{children}</>;
}

/** Centered empty state used by wishlist / cart (icon tile, text, green CTA, optional Sign In). */
export function IconEmpty({
  icon,
  title,
  text,
  cta,
  ctaHref,
  showSignIn,
}: {
  icon: IconDefinition;
  title: string;
  text: string;
  cta: string;
  ctaHref: string;
  showSignIn?: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-2xl text-gray-400">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-500">{text}</p>
      <Link
        href={ctaHref}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 font-semibold text-white transition hover:bg-primary-700"
      >
        {cta} <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
      </Link>
      {showSignIn && (
        <Link
          href="/login"
          className="mt-3 w-full rounded-lg border border-gray-200 bg-white py-3 text-center font-semibold text-gray-800 transition hover:bg-gray-50"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}

export const emptyIcons = { heart: faHeart, cart: faCartShopping };
