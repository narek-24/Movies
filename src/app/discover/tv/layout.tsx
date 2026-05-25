import { type Metadata } from "next";
import { tmdb } from "@/lib/api";
import { Suspense } from "react";
import Filters, { FiltersShell } from "../_components/filters";
import ScrollTopButton from "../_components/scroll-top";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Discover TV Shows | Browse & Filter Series",
  description:
    "Browse popular, trending, and hidden-gem TV series across genres. Filter shows by genre, rating, year, and more to find your next favorite.",
  keywords:
    "discover TV shows, television database, series search, TV genres, trending shows, TV ratings",
  openGraph: {
    type: "website",
    title: "Discover TV Shows | Browse & Filter Series",
    description:
      "Explore and discover TV shows by genre, rating, year, and more.",
    url: "https://movies-alpha-ruddy.vercel.app/discover/tv",
  },
  alternates: {
    canonical: "https://movies-alpha-ruddy.vercel.app/discover/tv",
  },
};

export default async function DisoverTvLayout({
  children,
}: LayoutProps<"/discover/tv">) {
  const tvGenres = await tmdb.GET("/3/genre/tv/list", {
    next: { tags: ["tv-genres"] },
    cache: "force-cache",
  });

  return (
    <>
      <div className="relative py-16 md:py-21">
        <Image
          alt="Discover TV shows hero background - Browse series by genre, rating, and year"
          src="https://image.tmdb.org/t/p/original/piXgY187CP4O5180A2fZX9BPfZe.jpg"
          fill
          preload
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_9%] opacity-60 dark:opacity-40"
        />
        <div className="to-background absolute inset-0 -z-10 bg-linear-to-b from-transparent"></div>
        <div className="container">
          <h1 className="mb-1">Discover TV Shows</h1>
          <p className="font-medium max-md:text-sm">
            Browse popular, trending, and hidden‑gem series across genres —
            filter by genre, rating, and year to find your next favorite.
          </p>
        </div>
      </div>
      <div className="container">
        <Suspense fallback={<FiltersShell />}>
          <Filters genres={tvGenres.data?.genres} />
        </Suspense>
        <ScrollTopButton />
        <div className="grow">{children}</div>
      </div>
    </>
  );
}
