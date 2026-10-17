"use client";

import type { InputHTMLAttributes } from "react";

export const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRe = /^01[0125][0-9]{8}$/;
export const passRe = /^.{6,}$/; // min 6 chars; the API reports any stricter rule

export function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-3.5 block text-base text-gray-800">{label}</span>
      <input
        {...props}
        className={`h-[52px] w-full rounded-lg border px-4 text-base outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 focus:border-green-500 focus:ring-green-100"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-md bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export function AuthCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {sub && <p className="mt-1 mb-5 text-sm text-gray-500">{sub}</p>}
      {children}
    </div>
  );
}
