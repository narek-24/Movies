import Image, { type ImageProps } from "next/image";
import { FileImage } from "lucide-react";

type Size =
  | "w45"
  | "w92"
  | "w154"
  | "w185"
  | "w300"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

interface TMDBImageProps extends Omit<ImageProps, "src"> {
  path: string | undefined;
  size: Size;
  fallback?: React.ReactNode;
}

export default function TMDBImage({
  path,
  size,
  alt = "",
  fallback = null,
  ...props
}: TMDBImageProps) {
  if (!path) {
    return (
      fallback ?? (
        <FileImage className="size-20 text-zinc-400 dark:text-zinc-500" />
      )
    );
  }

  return (
    <Image
      src={`https://image.tmdb.org/t/p/${size}${path}`}
      alt={alt}
      {...props}
    />
  );
}
