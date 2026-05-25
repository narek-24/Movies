import { type SearchResultsType } from "@/app/api/search/route";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TMDBImage from "../tmdb-image";

interface Props {
  setOpen: (val: boolean) => void;
}

export default function SearchContent({ setOpen }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);

  const { data, isError, isFetching } = useQuery<SearchResultsType>({
    queryKey: ["search", debouncedQuery],
    queryFn: () =>
      fetch(`/api/search?q=${debouncedQuery}`).then((res) => {
        if (res.ok) return res.json();
        throw Error("");
      }),
    enabled: !!debouncedQuery,
  });

  function handleSelect(url: string) {
    router.push(url);
    setOpen(false);
  }

  const results = data?.filter((i) => i.poster_path || i.profile_path);

  const hasResults = results && results.length > 0;
  const shouldShowContent = !!debouncedQuery;

  return (
    <Command shouldFilter={false}>
      <CommandInput
        autoFocus
        placeholder="Search for a movie, tv show or person..."
        value={query}
        onValueChange={(v) => setQuery(v)}
      />
      <CommandList className="h-[400px] overflow-y-auto">
        {/* Initial state - no query entered */}
        {!shouldShowContent && (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <p className="text-muted-foreground text-sm">
                Start typing to search for movies, TV shows, or people
              </p>
            </div>
          </CommandEmpty>
        )}

        {/* Loading state */}
        {shouldShowContent && isFetching && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-muted-foreground size-5 animate-spin" />
              <p className="text-muted-foreground text-sm">Searching...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {shouldShowContent && isError && !isFetching && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="text-destructive size-5" />
              <div className="text-center">
                <p className="text-destructive text-sm font-medium">
                  Something went wrong
                </p>
                <p className="text-muted-foreground text-xs">
                  Please try again later or try a different search
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results state */}
        {shouldShowContent && !isFetching && !isError && (
          <>
            {hasResults ? (
              <CommandGroup heading="Results">
                {results.map((res) => (
                  <CommandItem
                    onSelect={() =>
                      handleSelect(`/${res.media_type}/${res.id}`)
                    }
                    key={res.id}
                    value={res.id.toString()}
                    className="cursor-pointer"
                    role="link"
                  >
                    <div className="flex gap-2">
                      <TMDBImage
                        path={res.poster_path || res.profile_path}
                        alt=""
                        size="w92"
                        width={60}
                        height={90}
                        className="h-[90px] w-[60px] shrink-0 rounded bg-black/3 dark:bg-white/5"
                        fallback={<div></div>}
                      />
                      <div className="flex flex-col gap-1">
                        <span className="truncate font-medium">
                          {res.title ?? res.name ?? "Unknown"}
                        </span>
                        <span className="text-muted-foreground capitalize">
                          {res.media_type}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-6">
                  <p className="text-muted-foreground text-sm">
                    No results found
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Try searching for something else
                  </p>
                </div>
              </CommandEmpty>
            )}
          </>
        )}
      </CommandList>
    </Command>
  );
}
