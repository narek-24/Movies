"use client";

import type { DiscoverTvShowsType } from "@/app/api/discover/tv/route";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import DiscoverLoadingShell from "../_components/loading-shell";
import Card from "@/components/ui/card";
import Link from "next/link";

export default function DiscoverTvPage() {
  const searchParams = useSearchParams();
  const { ref } = useIntersectionObserver({
    onChange: (isIntersecting) => {
      if (isIntersecting && hasNextPage && !isFetching && !isError) {
        fetchNextPage();
      }
    },
    rootMargin: "450px",
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<DiscoverTvShowsType>({
    queryKey: [`tv-${searchParams.toString()}`],
    queryFn: ({ pageParam = 1 }) =>
      fetch(
        "/api/discover/tv?" + searchParams.toString() + `&page=${pageParam}`,
      ).then((res) => {
        if (res.ok) return res.json();
        throw Error("");
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return;
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1,
    retry: 1,
  });

  if (!data && isFetching) {
    return <DiscoverLoadingShell />;
  }

  const results = data?.pages.flatMap((p) => p?.results ?? []) ?? [];

  const initialError = isError && results.length === 0;
  const paginationError = isError && results.length > 0;

  if (initialError) {
    return (
      <div className="py-12 text-center" role="alert" aria-live="assertive">
        <h2 className="text-2xl font-semibold text-red-400">
          Could not load results
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {error?.message ||
            "There was a problem fetching tv-shows. This may be a network error or the server may be unavailable."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => refetch()}>Retry</Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div key={searchParams.toString()}>
      {results.length === 0 ? (
        <div className="py-12 text-center" role="status">
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Try adjusting your filters or clearing some options to broaden the
            search.
          </p>
        </div>
      ) : (
        <>
          <ul className="discover-grid">
            {results.map((tv, i) => (
              <Card key={`${tv.id}-${i}`}>
                <Card.Image path={tv.poster_path} />
                <Card.Title title={tv.name} href={`/tv/${tv.id}`} />
                <Card.Info rating={tv.vote_average} year={tv.first_air_date} />
              </Card>
            ))}
          </ul>

          <div className="mt-6 text-center">
            {paginationError && (
              <div role="alert" className="mb-3 text-sm text-red-400">
                Failed to load more results. You can retry.
              </div>
            )}

            {hasNextPage && (
              <div>
                <button
                  className="mx-auto mt-2 block cursor-pointer rounded bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:cursor-default disabled:bg-white/90"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage || isFetching}
                  ref={ref}
                  aria-label={
                    isFetchingNextPage
                      ? "Loading more results"
                      : "Load more results"
                  }
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
