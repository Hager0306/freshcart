import {
  faArrowRight,
  faCheck,
  faPaperPlane,
  faEnvelope,
  faHeadset,
  faRotateLeft,
  faShieldHalved,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import HomeCategories, { SectionTitle } from "@/components/HomeCategories";
import ProductList from "@/components/ProductList";

const perks = ["Fresh Picks Weekly", "Free Delivery Codes", "Members-Only Deals"];

export default function Home() {
  return (
    <>
      <div className="relative">
        <HeroSlider />
      </div>

      {/* feature strip */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {([
              ["bg-blue-50 text-blue-500", "Free Shipping", "On orders over 500 EGP", faTruck],
              ["bg-emerald-50 text-emerald-500", "Secure Payment", "100% secure transactions", faShieldHalved],
              ["bg-orange-50 text-orange-500", "Easy Returns", "14-day return policy", faRotateLeft],
              ["bg-purple-50 text-purple-500", "24/7 Support", "Dedicated support team", faHeadset],
            ] as const).map(([cls, t, d, ic]) => (
              <div key={t} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${cls}`}><FontAwesomeIcon icon={ic as typeof faTruck} /></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{t}</h3>
                  <p className="text-xs text-gray-500">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeCategories />

      {/* deals */}
      <section className="py-10">
        <div className="container mx-auto px-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div data-reveal="0" className="lift relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 p-8 text-white">
              <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
                  <span>🔥</span>
                  <span>Deal of the Day</span>
                </div>
                <h3 className="mb-2 text-2xl font-bold md:text-3xl">Fresh Organic Fruits</h3>
                <p className="mb-4 text-white/80">Get up to 40% off on selected organic fruits</p>
                <div className="mb-6 flex items-center gap-4">
                  <div className="text-3xl font-bold">40% OFF</div>
                  <div className="text-sm text-white/70">
                    Use code: <span className="font-bold text-white">ORGANIC40</span>
                  </div>
                </div>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-emerald-600 transition-colors hover:bg-gray-100">
                  Shop Now <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                </Link>
              </div>
            </div>

            <div data-reveal="2" className="lift relative overflow-hidden rounded-2xl bg-linear-to-br from-orange-400 to-rose-500 p-8 text-white">
              <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
                  <span>✨</span>
                  <span>New Arrivals</span>
                </div>
                <h3 className="mb-2 text-2xl font-bold md:text-3xl">Exotic Vegetables</h3>
                <p className="mb-4 text-white/80">Discover our latest collection of premium vegetables</p>
                <div className="mb-6 flex items-center gap-4">
                  <div className="text-3xl font-bold">25% OFF</div>
                  <div className="text-sm text-white/70">
                    Use code: <span className="font-bold text-white">FRESH25</span>
                  </div>
                </div>
                <Link href="/products?sort=-createdAt" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-orange-500 transition-colors hover:bg-gray-100">
                  Explore Now <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* featured products */}
      <section className="py-10">
        <div className="container mx-auto px-10">
          <SectionTitle big>
            Featured <span className="text-emerald-600">Products</span>
          </SectionTitle>
          <ProductList query={{}} limit={40} paginate={false} />
        </div>
      </section>

      {/* newsletter + app */}
      <section className="bg-linear-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-5">
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] border border-emerald-100/50 bg-linear-to-br from-emerald-50 via-white to-teal-50 shadow-2xl shadow-emerald-500/10">
              <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 -translate-y-1/2 translate-x-1/4 rounded-full bg-linear-to-br from-emerald-200/40 to-transparent blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/2 rounded-full bg-linear-to-tr from-teal-200/30 to-transparent blur-3xl" />
              <div className="relative grid gap-8 p-8 lg:grid-cols-5 lg:p-14">
                <div className="space-y-6 lg:col-span-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                      <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Newsletter</h3>
                      <p className="text-xs text-gray-500">50,000+ subscribers</p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold leading-snug text-gray-900 lg:text-4xl">
                      Get the Freshest Updates <span className="text-emerald-600">Delivered Free</span>
                    </h2>
                    <p className="mt-3 text-lg text-gray-500">Weekly recipes, seasonal offers &amp; exclusive member perks.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {perks.map((p) => (
                      <div key={p} className="flex items-center gap-2.5 rounded-full border border-emerald-100 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <FontAwesomeIcon icon={faCheck} className="text-xs" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{p}</span>
                      </div>
                    ))}
                  </div>
                  <form className="pt-2" action="#">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          placeholder="you@example.com"
                          className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 pl-5 pr-5 text-base text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>
                      <button
                        type="button"
                        className="group flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/40"
                      >
                        <span>Subscribe</span>
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </div>
                    <p className="mt-3 pl-1 text-xs text-gray-400">✨ Unsubscribe anytime. No spam, ever.</p>
                  </form>
                </div>

                <div className="lg:col-span-2 lg:border-l lg:border-emerald-100 lg:pl-8">
                  <div className="flex h-full flex-col justify-center">
                    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-900 to-gray-800 p-8 text-white">
                      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" />
                      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-teal-500/20 blur-2xl" />
                      <div className="relative space-y-5">
                        <div className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                          📱 MOBILE APP
                        </div>
                        <h3 className="text-2xl font-bold leading-tight">Shop Faster on Our App</h3>
                        <p className="text-sm leading-relaxed text-gray-400">Get app-exclusive deals &amp; 15% off your first order.</p>
                        <div className="flex flex-col gap-3 pt-2">
                          <a href="#" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/15">
                            <FontAwesomeIcon icon={faApple} className="text-2xl" />
                            <div className="text-left">
                              <div className="text-[10px] uppercase tracking-wide text-gray-400">Download on</div>
                              <div className="-mt-0.5 text-sm font-semibold">App Store</div>
                            </div>
                          </a>
                          <a href="#" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/15">
                            <FontAwesomeIcon icon={faGooglePlay} className="text-2xl" />
                            <div className="text-left">
                              <div className="text-[10px] uppercase tracking-wide text-gray-400">Get it on</div>
                              <div className="-mt-0.5 text-sm font-semibold">Google Play</div>
                            </div>
                          </a>
                        </div>
                        <div className="flex items-center gap-2 pt-2 text-sm">
                          <span className="text-yellow-400">★★★★★</span>
                          <span className="text-gray-400">4.9 • 100K+ downloads</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
