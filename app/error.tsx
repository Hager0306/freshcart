"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl py-10 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/error.svg" alt="Something went wrong" className="mx-auto w-full max-w-md" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Something went wrong</h1>
      <button onClick={reset} className="mt-6 rounded-xl bg-primary-600 px-8 py-3 font-semibold text-white hover:bg-primary-700">
        Try again
      </button>
    </div>
  );
}
