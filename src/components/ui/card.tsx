import TMDBImage from "../tmdb-image";
import Link from "next/link";
import { FileImage, Star } from "lucide-react";

export default function Card({ children }: { children: React.ReactNode }) {
  return <li className="relative z-0 shrink-0">{children}</li>;
}

function Image({ path }: { path?: string }) {
  return (
    <TMDBImage
      path={path}
      alt=""
      size="w300"
      width={300}
      height={450}
      loading="lazy"
      unoptimized
      className="aspect-30/45 rounded shadow-md/10 dark:shadow-md/40"
      fallback={
        <div className="grid aspect-30/45 place-content-center rounded bg-black/3 dark:bg-white/5">
          <FileImage className="size-20 text-zinc-400 dark:text-zinc-500" />
        </div>
      }
    />
  );
}

function Title({ title, href }: { title?: string; href: string }) {
  return (
    <h3 className="mt-1 truncate p-0.5 text-sm font-semibold">
      <Link
        href={href}
        prefetch={false}
        scroll={true}
        className="block p-0.5 after:absolute after:inset-0"
      >
        {title ?? "Untitled"}
      </Link>
    </h3>
  );
}

function Info({ rating, year }: { year?: string; rating: number }) {
  return (
    <div className="flex items-center justify-between px-1">
      <span className="flex items-center gap-1">
        <Star className="size-4 fill-amber-500 text-amber-500" />{" "}
        <span className="text-muted-foreground text-sm">
          {(rating ?? 0).toFixed(1)}
        </span>
      </span>

      {year && (
        <span className="text-muted-foreground text-sm">
          {new Date(year).getFullYear()}
        </span>
      )}
    </div>
  );
}

function Character({ character }: { character?: string }) {
  if (!character) return null;

  return (
    <p className="text-muted-foreground truncate px-1 text-sm">{character}</p>
  );
}

export function SkeletonCard() {
  return (
    <li className="m-1 shrink-0">
      <div className="skeleton aspect-30/45 rounded"></div>
      <div className="skeleton my-2 h-5 rounded"></div>
      <div className="skeleton h-4 rounded"></div>
    </li>
  );
}

Card.Image = Image;
Card.Title = Title;
Card.Info = Info;
Card.Character = Character;
