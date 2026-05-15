"use client";

import TMDBImage from "@/components/tmdb-image";
import Carousel from "@/components/ui/carousel";

interface Props {
  images?: ApiResponse<"/3/person/{person_id}/images">;
}

export default function PersonImages({ images }: Props) {
  if (!images || images.profiles?.length === 0) {
    return (
      <div className="text-muted-foreground h-20 text-sm">
        No photos available
      </div>
    );
  }

  return (
    <Carousel>
      {images.profiles?.map((image, i) => (
        <a
          key={i}
          target="_blank"
          className="shrink-0"
          href={`https://image.tmdb.org/t/p/original/${image.file_path}`}
        >
          <TMDBImage
            path={image.file_path}
            alt=""
            size="w300"
            width={224}
            height={336}
            className="shrink-0 rounded"
          />
        </a>
      ))}
    </Carousel>
  );
}
