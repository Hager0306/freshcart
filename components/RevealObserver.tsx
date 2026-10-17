"use client";

import { useEffect } from "react";

/**
 * Fades/slides every [data-reveal] element in as it scrolls into view (and ones added later).
 * Uses the Web Animations API so no attributes are written to server-rendered markup
 * (that is what caused the React hydration mismatch).
 */
export default function RevealObserver() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          const delay = (Number(el.dataset.reveal) || 0) * 70;
          el.animate(
            [
              { opacity: 0, translate: "0 28px" },
              { opacity: 1, translate: "0 0" },
            ],
            { duration: 650, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" },
          );
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const scan = () => {
      if (reduce) return;
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
