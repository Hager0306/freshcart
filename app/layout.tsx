import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Suspense } from "react";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageShell from "@/components/PageShell";
import RevealObserver from "@/components/RevealObserver";
import Providers from "@/components/Providers";
import { Spinner } from "@/components/ui";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "FreshCart",
  description: "FreshCart - E-commerce store (Route final project)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-medium antialiased">
        <Providers>
          <RevealObserver />
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <Suspense fallback={<Spinner />}>
            <PageShell>{children}</PageShell>
          </Suspense>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
