"use client";

import { faFacebookF, faInstagram, faLinkedinIn, faTwitter } from "@fortawesome/free-brands-svg-icons";
import {
  faCircleQuestion,
  faClock,
  faEnvelope,
  faHeadset,
  faLocationDot,
  faPaperPlane,
  faPhone,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "@/components/PageHeader";

const input =
  "w-full rounded-xl border border-gray-200 bg-white px-5 py-4 outline-none placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

function InfoCard({ icon, title, children }: { icon: IconDefinition; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <FontAwesomeIcon icon={icon} />
      </span>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with our team."
        icon={faHeadset}
      />
      <div className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <InfoCard icon={faPhone} title="Phone">
            <p className="text-gray-600">Mon-Fri from 8am to 6pm</p>
            <a href="tel:+18001234567" className="text-lg text-primary-600">+1 (800) 123-4567</a>
          </InfoCard>
          <InfoCard icon={faEnvelope} title="Email">
            <p className="text-gray-600">We&apos;ll respond within 24 hours</p>
            <a href="mailto:support@freshcart.com" className="text-lg text-primary-600">support@freshcart.com</a>
          </InfoCard>
          <InfoCard icon={faLocationDot} title="Office">
            <p className="text-gray-600">123 Commerce Street<br />New York, NY 10001<br />United States</p>
          </InfoCard>
          <InfoCard icon={faClock} title="Business Hours">
            <p className="text-gray-600">Monday - Friday: 8am - 6pm<br />Saturday: 9am - 4pm<br />Sunday: Closed</p>
          </InfoCard>
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Follow Us</h3>
            <div className="mt-6 flex gap-4">
              {[faFacebookF, faTwitter, faInstagram, faLinkedinIn].map((i, n) => (
                <a key={n} href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-600 hover:text-white">
                  <FontAwesomeIcon icon={i} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <form onSubmit={submit} className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
            <div className="mb-8 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <FontAwesomeIcon icon={faHeadset} />
              </span>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form and we&apos;ll get back to you</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-gray-700">Full Name
                <input required placeholder="John Doe" className={`${input} mt-2`} />
              </label>
              <label className="block text-gray-700">Email Address
                <input required type="email" placeholder="john@example.com" className={`${input} mt-2`} />
              </label>
            </div>
            <label className="mt-6 block text-gray-700">Subject
              <select required defaultValue="" className={`${input} mt-2`}>
                <option value="" disabled>Select a subject</option>
                <option>Order Inquiry</option>
                <option>Shipping &amp; Delivery</option>
                <option>Returns &amp; Refunds</option>
                <option>Other</option>
              </select>
            </label>
            <label className="mt-6 block text-gray-700">Message
              <textarea required rows={5} placeholder="How can we help you?" className={`${input} mt-2 resize-y`} />
            </label>
            <button disabled={sending} className="mt-8 inline-flex items-center gap-3 rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
              <FontAwesomeIcon icon={faPaperPlane} /> {sending ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="flex gap-4 rounded-2xl border border-primary-100 bg-primary-50 p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
              <FontAwesomeIcon icon={faCircleQuestion} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Looking for quick answers?</h3>
              <p className="text-gray-700">Check out our Help Center for frequently asked questions about orders, shipping, returns, and more.</p>
              <Link href="/help" className="mt-3 inline-block text-primary-600">Visit Help Center →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
