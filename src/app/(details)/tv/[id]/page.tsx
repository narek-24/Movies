import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";
import { FileImage } from "lucide-react";
import { notFound } from "next/navigation";
import { cache } from "react";
import { tmdb } from "@/lib/api";
import DetailsHeroSection from "../../_components/hero-section";
import TMDBImage from "@/components/tmdb-image";
import Credits from "../../_components/credits";

export const revalidate = 604800

const getTvData = cache(async (id: string) => {
  const { data } = await tmdb.GET("/3/tv/{series_id}", {
    params: {
      path: { series_id: Number(id) },
      query: { append_to_response: "credits,videos" },
    },
    next: {
      revalidate: 604800
    }
  });

  return data as typeof data & {
    credits?: ApiResponse<"/3/tv/{series_id}/credits">;
    videos?: ApiResponse<"/3/tv/{series_id}/videos">;
  };
});

export async function generateMetadata({
  params,
}: PageProps<"/tv/[id]">): Promise<Metadata> {
  const { id } = await params;
  const tv = await getTvData(id);

  if (!tv) {
    return {};
  }

  const posterImage = tv.poster_path
    ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
    : undefined;

  return {
    title: `${tv.name}${tv.first_air_date ? ` (${tv.first_air_date.split("-")[0]})` : ""} - TV Series Details`,
    description:
      tv.overview ||
      `Discover details about ${tv.name}, including cast, crew, episodes, and more.`,
    keywords: [
      tv.name,
      "TV series",
      "television",
      ...(tv.genres?.map((g) => g.name) || []),
      "cast",
      "crew",
      "episodes",
      tv.first_air_date?.split("-")[0],
    ]
      .filter(Boolean)
      .join(", "),
    openGraph: {
      title: tv.name,
      description: tv.overview || `Discover ${tv.name}`,
      type: "video.tv_show",
      images: posterImage ? [posterImage] : [],
      url: `https://movies-alpha-ruddy.vercel.app/tv/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: tv.name,
      description: tv.overview,
      images: posterImage ? [posterImage] : [],
    },
    alternates: {
      canonical: `https://movies-alpha-ruddy.vercel.app/tv/${id}`,
    },
  };
}

export default async function Page({ params }: PageProps<"/tv/[id]">) {
  const { id } = await params;
  const tv = await getTvData(id);

  if (!tv) notFound();

  const trailer = tv.videos?.results?.filter(
    (v) => v.official && v.site === "YouTube" && v.type === "Trailer",
  )[0];

  return (
    <>
      {/* HERO */}
      <DetailsHeroSection
        mediaType="tv"
        title={tv.name}
        rating={tv.vote_average}
        voteCount={tv.vote_count}
        backdrop={tv.backdrop_path}
        genres={tv.genres}
        tagline={tv.tagline}
      />

      {/* CONTENT */}
      <div className="space-y-12 lg:space-y-20">
        <div className="container flex flex-col gap-10 lg:flex-row-reverse lg:gap-16">
          <div className="shrink-0 lg:w-[300px]">
            <TMDBImage
              path={tv.poster_path}
              alt={`${tv.name} TV series poster`}
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

            <section aria-labelledby="details" className="lg:mt-6">
              <h2 id="details" className="mb-3 font-semibold max-lg:text-xl">
                Details
              </h2>
              <ul className="text-muted-foreground flex flex-wrap gap-4 text-sm lg:flex-col lg:gap-2">
                {tv.first_air_date && (
                  <li>Release: {formatDate(tv.first_air_date)}</li>
                )}
                {tv.spoken_languages && (
                  <li>Language: {tv.spoken_languages[0]?.english_name}</li>
                )}
                {tv.seasons && <li>Seasons: {tv.seasons.length}</li>}
                {tv.number_of_episodes > 0 && (
                  <li>Episodes: {tv.number_of_episodes}</li>
                )}
              </ul>
            </section>
          </div>

          <div className="h-fit max-w-full min-w-0 grow space-y-10">
            <section aria-describedby="overview">
              <h2 id="overview">Overview</h2>
              {tv.overview ? (
                <p className="max-w-3xl">{tv.overview}</p>
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
              <Credits credits={tv.credits} />
            )}
          </div>
        </div>

        {trailer && (
          <div className="container">
            <Credits credits={tv.credits} />
          </div>
        )}
      </div>
    </>
  );
}
