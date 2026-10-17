import { faBoxOpen, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

/** Full-width green banner used by Shop / Categories / Brands pages. */
export default function PageHeader({
  crumbs,
  title,
  subtitle,
  icon = faBoxOpen,
  image,
  tone = "green",
  large = false,
}: {
  crumbs: Crumb[];
  title: string;
  subtitle?: string;
  icon?: IconDefinition;
  image?: string;
  tone?: "green" | "purple";
  large?: boolean;
}) {
  return (
    <section className={`bg-linear-to-r text-white ${tone === "purple" ? "from-purple-600 to-purple-400" : "from-primary-500 to-primary-400"}`}>
      <div data-reveal="0" className="container mx-auto px-5 py-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-white/80">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="font-medium text-white">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="mt-6 flex items-center gap-4">
          <div className={`flex shrink-0 ${large ? "h-[100px] w-[100px] rounded-3xl" : "h-14 w-14"} items-center justify-center overflow-hidden bg-white/20 shadow-lg backdrop-blur-sm ${large ? "" : "rounded-xl"}`}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="h-10 w-10 object-contain" />
            ) : (
              <FontAwesomeIcon icon={icon} className={large ? "text-4xl" : "text-2xl"} />
            )}
          </div>
          <div>
            <h1 className={`font-bold ${large ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"}`}>{title}</h1>
            {subtitle && <p className="mt-1 text-white/90">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
