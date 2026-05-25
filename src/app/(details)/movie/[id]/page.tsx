import { formatDate, formatDollars } from "@/lib/utils";
import { type Metadata } from "next";
import { FileImage } from "lucide-react";
import { notFound } from "next/navigation";
import { cache } from "react";
import { tmdb } from "@/lib/api";
import DetailsHeroSection from "../../_components/hero-section";
import TMDBImage from "@/components/tmdb-image";
import Credits from "../../_components/credits";

export const revalidate = 604800;

const getMovieData = cache(async (movieId: number) => {
  const { data } = await tmdb.GET("/3/movie/{movie_id}", {
    params: {
      path: { movie_id: movieId },
      query: { append_to_response: "credits,videos" },
    },
    next: {
      revalidate: 604800,
    },
  });

  return data as typeof data & {
    credits?: ApiResponse<"/3/movie/{movie_id}/credits">;
    videos?: ApiResponse<"/3/movie/{movie_id}/videos">;
  };
});

export async function generateMetadata({
  params,
}: PageProps<"/movie/[id]">): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieData(Number(id));

  if (!movie) {
    return {};
  }

  const posterImage = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : undefined;

  return {
    title: `${movie.title}${movie.release_date ? ` (${movie.release_date.split("-")[0]})` : ""} - Movie Details`,
    description:
      movie.overview ||
      `Discover details about ${movie.title}, including cast, crew, ratings, and more.`,
    keywords: [
      movie.title,
      "movie",
      ...(movie.genres?.map((g) => g.name) || []),
      "cast",
      "crew",
      "details",
      movie.release_date?.split("-")[0],
    ]
      .filter(Boolean)
      .join(", "),
    openGraph: {
      title: movie.title,
      description: movie.overview || `Discover ${movie.title}`,
      type: "video.movie",
      images: posterImage ? [posterImage] : [],
      url: `https://movies-alpha-ruddy.vercel.app/movie/${id}`,
      releaseDate: movie.release_date,
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description: movie.overview,
      images: posterImage ? [posterImage] : [],
    },
    alternates: {
      canonical: `https://movies-alpha-ruddy.vercel.app/movie/${id}`,
    },
  };
}

export default async function Page({ params }: PageProps<"/movie/[id]">) {
  const { id } = await params;
  const movie = await getMovieData(Number(id));

  if (!movie) notFound();

  const trailer = movie.videos?.results?.filter(
    (v) => v.official && v.site === "YouTube" && v.type === "Trailer",
  )[0];

  return (
    <>
      {/* HERO */}
      <DetailsHeroSection
        mediaType="movie"
        title={movie.title}
        rating={movie.vote_average}
        voteCount={movie.vote_count}
        backdrop={movie.backdrop_path}
        genres={movie.genres}
        tagline={movie.tagline}
      />

      {/* CONTENT */}
      <div className="space-y-12 lg:space-y-20">
        <div className="container flex flex-col gap-10 lg:flex-row-reverse lg:gap-16">
          <div className="shrink-0 lg:w-[300px]">
            <TMDBImage
              path={movie.poster_path}
              alt={`${movie.title} movie poster`}
              size="w300"
              width={300}
              height={450}
              unoptimized
              className="shrink-0 rounded bg-black/3 shadow-lg/15 max-lg:hidden dark:bg-white/5 dark:shadow-lg/40"
              fallback={
                <div className="grid h-[450px] w-[300px] shrink-0 place-content-center rounded bg-black/3 dark:bg-white/5">
                  <FileImage className="size-40 text-neutral-300 dark:text-neutral-700" />
                </div>
              }
            />

            <section className="lg:mt-6" aria-labelledby="details">
              <h2 id="details" className="mb-3 font-semibold max-lg:text-xl">
                Details
              </h2>
              <ul className="text-muted-foreground flex flex-wrap gap-4 text-sm lg:flex-col lg:gap-2">
                {movie.release_date && (
                  <li>Release: {formatDate(movie.release_date)}</li>
                )}
                <li>Runtime: {movie.runtime} min</li>
                {movie.spoken_languages && (
                  <li>Language: {movie.spoken_languages[0]?.english_name}</li>
                )}
                <li>
                  Budget: {movie.budget ? formatDollars(movie.budget) : "N/A"}
                </li>
                <li>
                  Revenue:{" "}
                  {movie.revenue ? formatDollars(movie.revenue) : "N/A"}
                </li>
              </ul>
            </section>
          </div>

          <div className="h-fit max-w-full min-w-0 grow space-y-10">
            <section aria-describedby="overview">
              <h2 id="overview">Overview</h2>
              {movie.overview ? (
                <p className="max-w-3xl">{movie.overview}</p>
              ) : (
                <div className="text-muted-foreground h-20 text-sm">
                  No overview available
                </div>
              )}
            </section>

            {trailer ? (
              <section aria-describedby="trailer">
                <h2 id="trailer">Trailer</h2>
                {trailer && (
                  <div className="aspect-video overflow-hidden rounded-xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title="Trailer"
                      className="aspect-video w-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </section>
            ) : (
              <Credits credits={movie.credits} />
            )}
          </div>
        </div>

        {trailer && (
          <div className="container">
            <Credits credits={movie.credits} />
          </div>
        )}
      </div>
    </>
  );
}
