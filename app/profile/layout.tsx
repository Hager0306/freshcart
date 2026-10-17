"use client";

import { faChevronRight, faGear, faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { RequireAuth } from "@/components/ui";

const links = [
  { href: "/profile/addresses", label: "My Addresses", icon: faLocationDot },
  { href: "/profile/settings", label: "Settings", icon: faGear },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <RequireAuth>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "My Account" }]}
        title="My Account"
        subtitle="Manage your addresses and account settings"
        icon={faUser}
      />
      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[360px_1fr]">
        <aside className="h-fit overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <h2 className="border-b border-gray-100 px-5 py-4 text-lg font-semibold text-gray-900">My Account</h2>
          <nav className="space-y-1 p-2">
            {links.map((l) => {
              const on = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-4 rounded-xl p-3 text-lg ${on ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-base ${on ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                    <FontAwesomeIcon icon={l.icon} />
                  </span>
                  <span className="flex-1">{l.label}</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                </Link>
              );
            })}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </RequireAuth>
  );
}
