import { faAppleWhole, faCarrot, faHouse, faLeaf, faArrowLeft, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import GoBack from "@/components/GoBack";

export const metadata = { title: "Page Not Found | FreshCart" };

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-250px)] overflow-hidden bg-linear-to-b from-white via-primary-50/40 to-white px-4 py-16 text-center">
      <FontAwesomeIcon icon={faAppleWhole} className="absolute left-[6%] top-12 text-5xl text-primary-200" />
      <FontAwesomeIcon icon={faCarrot} className="absolute right-[10%] top-32 text-5xl text-primary-200" />
      <FontAwesomeIcon icon={faAppleWhole} className="absolute left-[15%] top-[62%] text-3xl text-primary-200" />
      <FontAwesomeIcon icon={faCarrot} className="absolute right-[6%] top-[62%] text-4xl text-primary-200" />
      <FontAwesomeIcon icon={faLeaf} className="absolute bottom-10 left-[8%] text-5xl text-primary-300" />

      <div className="relative mx-auto mt-6 h-[220px] w-[300px]">
        <div className="absolute inset-0 flex items-center justify-center rounded-[2.5rem] bg-white shadow-xl shadow-primary-500/10">
          <FontAwesomeIcon icon={faCartShopping} className="text-[80px] text-primary-300" />
        </div>
        <span className="absolute -right-4 -top-5 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-primary-600 text-3xl font-bold text-white shadow-xl ring-8 ring-white/80">
          404
        </span>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <span className="h-3 w-3 rounded-full bg-primary-400" />
        <span className="h-5 w-10 rounded-b-full border-b-2 border-primary-400" />
        <span className="h-3 w-3 rounded-full bg-primary-400" />
      </div>

      <h1 className="mt-14 text-6xl font-extrabold tracking-tight text-gray-900">Oops! Nothing Here</h1>
      <p className="mx-auto mt-5 max-w-3xl text-2xl leading-relaxed text-gray-600">
        Looks like this page went out of stock! Don&apos;t worry, there&apos;s plenty more fresh content to explore.
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
        <Link href="/" className="rounded-xl bg-primary-600 px-8 py-5 text-2xl font-semibold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700">
          <FontAwesomeIcon icon={faHouse} className="mr-4" />Go to Homepage
        </Link>
        <GoBack className="rounded-xl border border-gray-100 bg-white px-8 py-5 text-2xl font-semibold text-gray-900 shadow-md hover:bg-gray-50">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-4" />Go Back
        </GoBack>
      </div>
    </div>
  );
}
