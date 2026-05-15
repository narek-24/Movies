"use client";

import { MoveLeft, MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SkeletonCard } from "./card";
import { Button } from "./button";

interface Props {
  children: React.ReactNode;
}

export default function Carousel({ children }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  function handleScroll(e: React.UIEvent<HTMLUListElement, UIEvent>) {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    const maxScrollLeft = scrollWidth - clientWidth - 20;
    setIsAtStart(scrollLeft <= 10);
    setIsAtEnd(scrollLeft >= Math.floor(maxScrollLeft));
  }

  useEffect(() => {
    if (ref.current) {
      setIsAtStart(true);
      setIsAtEnd(ref.current.scrollWidth <= ref.current.clientWidth);
    }
  }, []);

  function handleClick(dir: 1 | -1) {
    ref.current?.scrollBy({
      left: (ref.current.clientWidth - 100) * dir,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative isolate">
      {!isAtStart && (
        <Button
          size="icon-lg"
          className="absolute top-1/3 -left-4 z-20 rounded-full shadow-lg max-md:hidden dark:shadow-lg/40"
          onClick={() => handleClick(-1)}
        >
          <span className="sr-only">Sroll left</span>
          <MoveLeft />
        </Button>
      )}

      <ul
        className="flex snap-x scroll-p-2 gap-6 overflow-x-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>li]:w-56 [&>li]:shrink-0 [&>li]:snap-start"
        onScroll={handleScroll}
        ref={ref}
      >
        {children}
      </ul>

      {!isAtEnd && (
        <Button
          size="icon-lg"
          className="absolute top-1/3 -right-4 z-20 rounded-full shadow-lg max-md:hidden dark:shadow-lg/40"
          onClick={() => handleClick(1)}
        >
          <span className="sr-only">Scroll right</span>
          <MoveRight />
        </Button>
      )}
    </div>
  );
}

export function SkeletonCarousel() {
  const arr = new Array(20).fill(0);

  return (
    <Carousel>
      {arr.map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </Carousel>
  );
}
