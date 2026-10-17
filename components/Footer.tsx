import {
  faEnvelope,
  faLocationDot,
  faPhone,
  faRotateLeft,
  faShieldHalved,
  faTruck,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCcMastercard,
  faCcPaypal,
  faCcVisa,
  faFacebookF,
  faInstagram,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const col = "text-sm text-gray-400 transition-colors hover:text-primary-400";

export function TrustStrip() {
  const items = [
    { icon: faTruck, t: "Free Shipping", d: "On orders over 500 EGP" },
    { icon: faRotateLeft, t: "Easy Returns", d: "14-day return policy" },
    { icon: faShieldHalved, t: "Secure Payment", d: "100% secure checkout" },
    { icon: faHeadset, t: "24/7 Support", d: "Contact us anytime" },
  ];
  return (
    <div className="border-y border-primary-100 bg-primary-50">
      <div className="container mx-auto px-5 py-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div key={i.t} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <FontAwesomeIcon icon={i.icon} className="text-lg" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{i.t}</h4>
                <p className="text-xs text-gray-500">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <TrustStrip />
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-5 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <Link href="/" className="mb-6 inline-block">
                <div className="inline-block rounded-lg bg-white px-4 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/freshcart-logo.svg" alt="FreshCart" className="h-10 w-auto" />
                </div>
              </Link>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                FreshCart is your one-stop destination for quality products. From fashion to
                electronics, we bring you the best brands at competitive prices with a seamless
                shopping experience.
              </p>
              <div className="mb-6 space-y-3">
                <a href="tel:+18001234567" className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-primary-400">
                  <FontAwesomeIcon icon={faPhone} className="w-4 text-primary-500" />
                  <span>+1 (800) 123-4567</span>
                </a>
                <a href="mailto:support@freshcart.com" className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-primary-400">
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 text-primary-500" />
                  <span>support@freshcart.com</span>
                </a>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <FontAwesomeIcon icon={faLocationDot} className="mt-1 w-4 text-primary-500" />
                  <span>123 Commerce Street, New York, NY 10001</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {[faFacebookF, faXTwitter, faInstagram, faYoutube].map((ic, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-primary-600 hover:text-white"
                  >
                    <FontAwesomeIcon icon={ic} />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-5 text-lg font-semibold">Shop</h3>
              <ul className="space-y-3">
                <li><Link href="/products" className={col}>All Products</Link></li>
                <li><Link href="/categories" className={col}>Categories</Link></li>
                <li><Link href="/brands" className={col}>Brands</Link></li>
                <li><Link href="/products?category=6439d58a0049ad0b52b9003f" className={col}>Electronics</Link></li>
                <li><Link href="/products?category=6439d2d167d9aa4ca970649f" className={col}>Men&apos;s Fashion</Link></li>
                <li><Link href="/products?category=6439d5b90049ad0b52b90048" className={col}>Women&apos;s Fashion</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-5 text-lg font-semibold">Account</h3>
              <ul className="space-y-3">
                <li><Link href="/profile" className={col}>My Account</Link></li>
                <li><Link href="/orders" className={col}>Order History</Link></li>
                <li><Link href="/wishlist" className={col}>Wishlist</Link></li>
                <li><Link href="/cart" className={col}>Shopping Cart</Link></li>
                <li><Link href="/login" className={col}>Sign In</Link></li>
                <li><Link href="/register" className={col}>Create Account</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-5 text-lg font-semibold">Support</h3>
              <ul className="space-y-3">
                <li><a href="mailto:support@freshcart.com" className={col}>Contact Us</a></li>
                <li><Link href="/help" className={col}>Help Center</Link></li>
                <li><Link href="/shipping" className={col}>Shipping Info</Link></li>
                <li><Link href="/returns" className={col}>Returns &amp; Refunds</Link></li>
                <li><Link href="/track-order" className={col}>Track Order</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-5 text-lg font-semibold">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className={col}>Privacy Policy</Link></li>
                <li><Link href="/terms" className={col}>Terms of Service</Link></li>
                <li><Link href="/privacy" className={col}>Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="container mx-auto px-5 py-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-gray-500 md:text-left">© 2026 FreshCart. All rights reserved.</p>
              <div className="flex items-center gap-4">
                {[
                  [faCcVisa, "Visa"],
                  [faCcMastercard, "Mastercard"],
                  [faCcPaypal, "PayPal"],
                ].map(([ic, name]) => (
                  <div key={name as string} className="flex items-center gap-2 text-sm text-gray-500">
                    <FontAwesomeIcon icon={ic as typeof faCcVisa} className="text-2xl" />
                    <span>{name as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
