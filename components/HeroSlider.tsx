"use client";

import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

/*
 * Slider images live in /public/images (slider-image-1..3.jpeg).
 */
const slides = [
  {
    title: "Fresh Products Delivered to your Door",
    text: "Get 20% off your first order",
    primary: { label: "Shop Now", href: "/products", color: "text-green-500" },
    secondary: { label: "View Deals", href: "/products?sort=-sold" },
    image: "/images/slider-image-1.jpeg",
  },
  {
    title: "Premium Quality Guaranteed",
    text: "Fresh from farm to your table",
    primary: { label: "Shop Now", href: "/products", color: "text-blue-500" },
    secondary: { label: "Learn More", href: "/brands" },
    image: "/images/slider-image-2.jpeg",
  },
  {
    title: "Fast & Free Delivery",
    text: "Same day delivery available",
    primary: { label: "Order Now", href: "/products", color: "text-purple-500" },
    secondary: { label: "Delivery Info", href: "/orders" },
    image: "/images/slider-image-3.jpeg",
  },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (n: number) => setI((n + slides.length) % slides.length);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {slides.map((s, n) => (
          <div key={s.title} data-active={n === i} className="hero-slide w-full shrink-0">
            <div
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="flex h-[400px] items-center justify-center bg-green-600"
            >
              <div className="h-full w-full bg-linear-to-r from-green-500/90 to-green-400/50 p-4 py-20 text-white">
                <div className="hero-copy container mx-auto h-full content-center px-5">
                  <h2 className="mb-4 max-w-96 text-3xl font-bold text-white">{s.title}</h2>
                  <p>{s.text}</p>
                  <div className="mt-4">
                    <Link
                      href={s.primary.href}
                      className={`inline-block rounded-lg border-2 border-white/50 bg-white px-6 py-2 font-semibold transition-transform hover:scale-105 ${s.primary.color}`}
                    >
                      {s.primary.label}
                    </Link>
                    <Link
                      href={s.secondary.href}
                      className="ml-2 inline-block rounded-lg border-2 border-white/50 bg-transparent px-6 py-2 font-semibold text-white transition-transform hover:scale-105"
                    >
                      {s.secondary.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {slides.map((s, n) => (
          <button
            key={s.title}
            onClick={() => setI(n)}
            data-active={n === i}
            className="hero-dot"
            aria-label={`Slide ${n + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => go(i - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-green-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white hover:text-green-600 md:flex"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        onClick={() => go(i + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-green-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white hover:text-green-600 md:flex"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
