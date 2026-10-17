import { faArrowLeft, faArrowRight, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import type { ReactNode } from "react";
import PageHeader from "./PageHeader";

export interface Article {
  icon: IconDefinition;
  title: string;
  /** list items; `lead` is rendered bold before the text */
  items?: { lead?: string; text: string }[];
  /** or a paragraph */
  body?: ReactNode;
}

export default function LegalPage({
  title,
  headerIcon,
  notice,
  articles,
  next,
}: {
  title: string;
  headerIcon: IconDefinition;
  notice: { tone: "green" | "amber"; icon: IconDefinition; title: string; text: string };
  articles: Article[];
  next: { label: string; href: string };
}) {
  const amber = notice.tone === "amber";
  return (
    <>
      <PageHeader
        large
        crumbs={[{ label: "Home", href: "/" }, { label: title }]}
        title={title}
        subtitle="Last updated: February 2026"
        icon={headerIcon}
      />
      <div className="container mx-auto px-5 py-10">
        <div
          className={`flex gap-5 rounded-3xl border p-8 shadow-sm ${
            amber ? "border-amber-200 bg-amber-50" : "border-primary-200 bg-primary-50"
          }`}
        >
          <span
            className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl text-2xl text-white shadow-lg ${
              amber ? "bg-orange-500" : "bg-primary-600"
            }`}
          >
            <FontAwesomeIcon icon={notice.icon} />
          </span>
          <div>
            <h2 className={`text-xl font-semibold ${amber ? "text-amber-900" : "text-gray-900"}`}>{notice.title}</h2>
            <p className={`mt-2 text-lg leading-relaxed ${amber ? "text-amber-900" : "text-gray-700"}`}>{notice.text}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {articles.map((a, n) => (
            <article key={a.title} className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
              <header className="mb-6 flex items-center gap-5">
                <span className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-primary-50 text-2xl text-primary-600">
                  <FontAwesomeIcon icon={a.icon} />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Article {n + 1}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{a.title}</h3>
                </div>
              </header>
              {a.items ? (
                <ol className="space-y-3">
                  {a.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-4 text-lg text-gray-700">
                      <span className="mt-1 flex h-6 min-w-7 items-center justify-center rounded-md bg-primary-50 px-1 text-xs font-semibold text-primary-600">
                        {n + 1}.{i + 1}
                      </span>
                      <span>
                        {it.lead && <strong className="font-semibold text-gray-900">{it.lead} </strong>}
                        {it.text}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-lg leading-relaxed text-gray-700">{a.body}</p>
              )}
            </article>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-10">
          <Link href="/" className="rounded-xl bg-gray-100 px-6 py-4 text-lg font-medium text-gray-700 hover:bg-gray-200">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-3" />Back to Home
          </Link>
          <Link href={next.href} className="rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700">
            {next.label}<FontAwesomeIcon icon={faArrowRight} className="ml-3" />
          </Link>
        </div>
      </div>
    </>
  );
}
