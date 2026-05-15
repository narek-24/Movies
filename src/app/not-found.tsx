import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center pt-40">
      <div className="text-center">
        <h1 className="mb-8 text-6xl font-extrabold md:text-8xl">404</h1>
        <Link
          href="/"
          replace
          className="bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer rounded-full px-8 py-2.5 font-semibold"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
