import Link from "next/link";

export default function Logo({ className = "h-10" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="FreshCart">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/freshcart-logo.svg" alt="FreshCart" className={`${className} w-auto`} />
    </Link>
  );
}
