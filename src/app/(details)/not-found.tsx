import Link from "next/link";

export default function DetailsNotFound() {
  return (
    <div className="flex justify-center pt-40">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-extrabold md:text-8xl">404</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Could not find what you are searching for
        </p>
        <Link
          href="/"
          replace
          className="cursor-pointer rounded-full bg-white px-8 py-2.5 font-semibold text-black hover:bg-white/90"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
