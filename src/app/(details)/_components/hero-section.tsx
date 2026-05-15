import TMDBImage from "@/components/tmdb-image";
import Link from "next/link";
import { Star } from "lucide-react";

interface Props {
  mediaType: "movie" | "tv";
  title?: string;
  backdrop?: string;
  tagline?: string;
  rating: number;
  voteCount: number;
  genres?: { id: number; name?: string }[];
}

export default function DetailsHeroSection(props: Props) {
  return (
    <section className="relative mb-8 pt-20 pb-20 md:mb-12 md:pt-28 md:pb-36">
      {props.backdrop ? (
        <>
          <TMDBImage
            path={props.backdrop}
            alt=""
            size="w1280"
            fill
            preload
            sizes="100vw"
            unoptimized
            className="absolute inset-0 -z-20 object-cover object-[50%_20%]"
            fallback={<></>}
          />
          <div className="from-background/40 dark:from-background/50 to-background absolute inset-0 -z-10 bg-linear-to-b"></div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 -z-20 bg-linear-to-r from-gray-500 to-slate-500 opacity-10"></div>
          <div className="to-background absolute inset-0 -z-10 bg-linear-to-b from-transparent"></div>
        </>
      )}

      <div className="container">
        <h1 id="title" className="mb-1">
          {props.title}
        </h1>

        {props.tagline && <p className="mb-4">{props.tagline}</p>}

        <div className="mb-4 flex items-center gap-4 font-medium">
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-amber-500 text-amber-500" />{" "}
            <span>{(props.rating ?? 0).toFixed(1)}</span>
          </span>
          <span>{props.voteCount} votes</span>
        </div>

        {props.genres && (
          <ul className="mb-4 flex flex-wrap gap-2">
            {props.genres.map((genre) => (
              <li key={genre.id}>
                <Link
                  className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-offset-background rounded-full px-4 py-1.5 text-xs font-semibold focus-visible:ring-offset-2"
                  href={`/discover/${props.mediaType}?with_genres=${genre.id}`}
                >
                  {genre.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
