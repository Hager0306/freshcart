"use client";

import {
  faAddressCard,
  faArrowRight,
  faBoxOpen,
  faCircleUser,
  faGear,
  faBars,
  faChevronDown,
  faHeadset,
  faCartShopping,
  faMagnifyingGlass,
  faPhone,
  faRightFromBracket,
  faTruckFast,
  faUserPlus,
  faWandMagicSparkles,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/types";
import Logo from "./Logo";
import { useAuth, useCart, useWishlist } from "./Providers";

const NAV_CATS = ["Electronics", "Women's Fashion", "Men's Fashion", "Beauty & Health"];

function CountBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-bold text-white">
      {n}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const { count } = useCart();
  const wish = useWishlist();
  const [cats, setCats] = useState<Category[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    getCategories().then(setCats).catch(() => setCats([]));
  }, []);

  useEffect(() => {
    setDrawer(false);
    setUserMenu(false);
  }, [pathname]);

  const navCats = NAV_CATS.map((n) => cats.find((c) => c.name === n)).filter(
    (c): c is Category => Boolean(c),
  );
  const shownCats = navCats.length ? navCats : cats.slice(0, 4);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setDrawer(false);
    router.push(q.trim() ? `/products?keyword=${encodeURIComponent(q.trim())}` : "/products");
  };

  const doLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <div className="hidden border-b border-gray-100 text-sm lg:block">
        <div className="container mx-auto px-5">
          <div className="flex h-10 items-center justify-between">
            <div className="flex items-center gap-6 text-gray-500">
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTruckFast} className="text-primary-600" />
                <span>Free Shipping on Orders 500 EGP</span>
              </span>
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-primary-600" />
                <span>New Arrivals Daily</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-gray-500">
                <a href="tel:+18001234567" className="flex items-center gap-1.5 transition-colors hover:text-primary-600">
                  <FontAwesomeIcon icon={faPhone} className="text-xs" />
                  <span>+1 (800) 123-4567</span>
                </a>
                <a href="mailto:support@freshcart.com" className="flex items-center gap-1.5 transition-colors hover:text-primary-600">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                  <span>support@freshcart.com</span>
                </a>
              </div>
              <span className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-4">
                {token ? (
                  <>
                    <Link href="/profile/addresses" className="flex items-center gap-1.5 text-gray-600 transition-colors hover:text-primary-600">
                      <FontAwesomeIcon icon={faUser} className="text-xs" />
                      <span>{user?.name ?? "My Account"}</span>
                    </Link>
                    <button onClick={doLogout} className="flex items-center gap-1.5 text-gray-600 transition-colors hover:text-red-500">
                      <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex items-center gap-1.5 text-gray-600 transition-colors hover:text-primary-600">
                      <FontAwesomeIcon icon={faUser} className="text-xs" />
                      <span>Sign In</span>
                    </Link>
                    <Link href="/register" className="flex items-center gap-1.5 text-gray-600 transition-colors hover:text-primary-600">
                      <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="bg-white">
          <div className="container mx-auto px-5">
            <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px] lg:gap-8">
              <div className="shrink-0">
                <Logo />
              </div>

              <form onSubmit={search} className="hidden max-w-2xl flex-1 lg:flex">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search for products, brands and more..."
                    className="w-full rounded-full border border-gray-200 bg-gray-50/50 px-5 py-3 pr-12 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700"
                    aria-label="Search"
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
                  </button>
                </div>
              </form>

              <nav className="hidden items-center gap-6 xl:flex">
                <Link href="/" className="font-medium text-gray-700 transition-colors hover:text-primary-600">
                  Home
                </Link>
                <Link href="/products" className="font-medium text-gray-700 transition-colors hover:text-primary-600">
                  Shop
                </Link>
                <div className="group relative">
                  <button className="flex items-center gap-1.5 py-2 font-medium text-gray-700 transition-colors hover:text-primary-600">
                    Categories
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </button>
                  <div className="invisible absolute left-0 top-full pt-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[200px] rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                      <Link href="/categories" className="block px-4 py-2.5 text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600">
                        All Categories
                      </Link>
                      {shownCats.map((c) => (
                        <Link
                          key={c._id}
                          href={`/products?category=${c._id}`}
                          className="block px-4 py-2.5 text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Link href="/brands" className="font-medium text-gray-700 transition-colors hover:text-primary-600">
                  Brands
                </Link>
              </nav>

              <div className="flex items-center gap-1 lg:gap-2">
                <Link
                  href="/contact"
                  className="mr-2 hidden items-center gap-2 border-r border-gray-200 pr-3 transition-opacity hover:opacity-80 lg:flex"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <FontAwesomeIcon icon={faHeadset} />
                  </div>
                  <div className="text-xs">
                    <div className="text-gray-400">Support</div>
                    <div className="font-semibold text-gray-700">24/7 Help</div>
                  </div>
                </Link>

                <Link href="/wishlist" className="relative rounded-full p-2.5 text-gray-700 transition-colors hover:bg-gray-100" aria-label="Wishlist">
                  <FontAwesomeIcon icon={faHeart} className="text-lg" />
                  <CountBadge n={wish.items.length} />
                </Link>
                <Link href="/cart" className="relative rounded-full p-2.5 text-gray-700 transition-colors hover:bg-gray-100" aria-label="Cart">
                  <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
                  <CountBadge n={count} />
                </Link>

                {token ? (
                  <div className="relative hidden lg:block">
                    <button
                      onClick={() => setUserMenu((o) => !o)}
                      className="ml-2 rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100"
                      aria-label="Account menu"
                    >
                      <FontAwesomeIcon icon={faCircleUser} className="text-2xl" />
                    </button>
                    {userMenu && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-gray-100 bg-white pb-2 shadow-xl">
                        <div className="flex items-center gap-4 border-b border-gray-100 p-5">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl text-primary-600"><FontAwesomeIcon icon={faCircleUser} /></span>
                          <span className="font-semibold text-gray-900">{user?.name}</span>
                        </div>
                        <div className="py-2">
                          {[
                            ["/profile/addresses", "My Profile", faUser],
                            ["/orders", "My Orders", faBoxOpen],
                            ["/wishlist", "My Wishlist", faHeart],
                            ["/profile/addresses", "Addresses", faAddressCard],
                            ["/profile/settings", "Settings", faGear],
                          ].map(([href, label, icon]) => (
                            <Link
                              key={label as string}
                              href={href as string}
                              className={`flex items-center gap-4 px-5 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 ${pathname === href && label !== "My Profile" ? "bg-primary-50 text-primary-600" : ""}`}
                            >
                              <FontAwesomeIcon icon={icon as typeof faUser} className="w-4 text-gray-400" />
                              {label as string}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 pt-2">
                          <button onClick={doLogout} className="flex w-full items-center gap-4 px-5 py-3 text-left text-red-500 hover:bg-red-50">
                            <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="ml-2 hidden items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 lg:flex"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Sign In
                  </Link>
                )}

                <button
                  onClick={() => setDrawer(true)}
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 lg:hidden"
                  aria-label="Open menu"
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      <div
        onClick={() => setDrawer(false)}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden ${
          drawer ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
            drawer ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-4">
            <Logo />
            <button onClick={() => setDrawer(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200" aria-label="Close menu">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <form onSubmit={search} className="border-b border-gray-100 p-4">
            <div className="relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <button type="submit" className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-primary-600 text-white" aria-label="Search">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
              </button>
            </div>
          </form>

          <nav className="p-4">
            <div className="space-y-1">
              {[
                ["Home", "/"],
                ["Shop", "/products"],
                ["Categories", "/categories"],
                ["Brands", "/brands"],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600">
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="mx-4 border-t border-gray-100" />
          <div className="space-y-1 p-4">
            <Link href="/wishlist" className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-primary-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <FontAwesomeIcon icon={faHeart} />
                </div>
                <span className="font-medium text-gray-700">Wishlist</span>
              </div>
            </Link>
            <Link href="/cart" className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-primary-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <FontAwesomeIcon icon={faCartShopping} />
                </div>
                <span className="font-medium text-gray-700">Cart</span>
              </div>
            </Link>
          </div>

          <div className="mx-4 border-t border-gray-100" />
          <div className="space-y-1 p-4">
            {token ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/profile" className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-700">
                  Profile
                </Link>
                <button onClick={doLogout} className="flex items-center justify-center gap-2 rounded-xl border-2 border-primary-600 px-4 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/login" className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-700">
                  Sign In
                </Link>
                <Link href="/register" className="flex items-center justify-center gap-2 rounded-xl border-2 border-primary-600 px-4 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <Link href="/contact" className="mx-4 mt-2 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-primary-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <FontAwesomeIcon icon={faHeadset} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">Need Help?</div>
              <div className="text-sm text-primary-600">Contact Support</div>
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="ml-auto text-xs text-gray-400" />
          </Link>
        </div>
      </div>
    </>
  );
}
