import { type Metadata } from "next";
import { tmdb } from "@/lib/api";
import { Suspense } from "react";
import Filters, { FiltersShell } from "../_components/filters";
import ScrollTopButton from "../_components/scroll-top";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Discover Movies | Browse & Filter Films",
  description:
    "Explore popular, new, and classic films across genres. Filter movies by genre, rating, release year, and more to find your next favorite watch.",
  keywords:
    "discover movies, movie database, film search, movie genres, trending films, movie ratings",
  openGraph: {
    type: "website",
    title: "Discover Movies | Browse & Filter Films",
    description:
      "Explore and discover movies by genre, rating, year, and more.",
    url: "https://movies-alpha-ruddy.vercel.app/discover/movie",
  },
  alternates: {
    canonical: "https://movies-alpha-ruddy.vercel.app/discover/movie",
  },
};

export default async function DisoverMovieLayout({
  children,
}: LayoutProps<"/discover/movie">) {
  const movieGenres = await tmdb.GET("/3/genre/movie/list", {
    next: { tags: ["movie-genres"] },
    cache: "force-cache",
  });

  return (
    <>
      <div className="relative py-16 md:py-21">
        <Image
          alt="Discover movies hero background - Browse films by genre, rating, and year"
          src="https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg"
          fill
          preload
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_15%] opacity-60 dark:opacity-40"
        />
        <div className="to-background absolute inset-0 -z-10 bg-linear-to-b from-transparent"></div>
        <div className="container">
          <h1 className="mb-1">Discover Movies</h1>
          <p className="font-medium max-md:text-sm">
            Explore popular, new, and classic films across genres — filter by
            genre, rating, and year to find your next watch.
          </p>
        </div>
      </div>
      <div className="container">
        <Suspense fallback={<FiltersShell />}>
          <Filters genres={movieGenres.data?.genres} />
        </Suspense>
        <ScrollTopButton />
        <div className="grow">{children}</div>
      </div>
    </>
  );
}
