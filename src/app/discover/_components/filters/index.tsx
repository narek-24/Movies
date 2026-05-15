"use client";

import { languageOptions, movieOptions, tvOptions } from "./options";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FiltersProps {
  genres?: { id: number; name?: string }[];
}

export default function Filters({ genres }: FiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const options = pathname?.includes("/discover/tv") ? tvOptions : movieOptions;

  const [localSort, setLocalSort] = useState("");
  const [localGenreIds, setLocalGenreIds] = useState<number[]>([]);
  const [localLanguage, setLocalLanguage] = useState("");
  const [localVoteCount, setLocalVoteCount] = useState("");
  const [localVoteAverage, setLocalVoteAverage] = useState("");
  const [localReleaseYear, setLocalReleaseYear] = useState("");
  const [localReleaseYearLte, setLocalReleaseYearLte] = useState("");

  useEffect(() => {
    const s = searchParams.get("sort_by") ?? "";
    const g = searchParams.get("with_genres") ?? "";
    const vc = searchParams.get("vote_count.gte") ?? "";
    const va = searchParams.get("vote_average.gte") ?? "";
    const lang = searchParams.get("with_original_language") ?? "";
    const releaseDateGte = searchParams.get("primary_release_date.gte") ?? "";
    const releaseDateLte = searchParams.get("primary_release_date.lte") ?? "";

    setLocalSort(s);
    setLocalLanguage(lang);
    setLocalVoteCount(vc);
    setLocalVoteAverage(va);
    setLocalGenreIds(g ? g.split(",").map((x) => Number(x)) : []);
    // If there is a release_date.gte (YYYY-MM-DD), extract the year for the year-only input.
    if (releaseDateGte) {
      const match = releaseDateGte.match(/^(\d{4})/);
      setLocalReleaseYear(match ? (match[1] ?? "") : "");
    } else {
      setLocalReleaseYear("");
    }

    // extract year from primary_release_date.lte (YYYY-MM-DD -> YYYY)
    if (releaseDateLte) {
      const match = releaseDateLte.match(/^(\d{4})/);
      setLocalReleaseYearLte(match ? (match[1] ?? "") : "");
    } else {
      setLocalReleaseYearLte("");
    }
  }, [searchParams]);

  function resetFilters() {
    history.replaceState(null, "", `${pathname}`);
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (localSort) params.set("sort_by", localSort);
    else params.delete("sort_by");

    if (localGenreIds.length > 0)
      params.set("with_genres", localGenreIds.join(","));
    else params.delete("with_genres");

    if (localVoteCount && localVoteCount !== "0")
      params.set("vote_count.gte", String(localVoteCount));
    else params.delete("vote_count.gte");

    if (localVoteAverage && localVoteAverage !== "0")
      params.set("vote_average.gte", String(localVoteAverage));
    else params.delete("vote_average.gte");

    // Convert year-only input to a primary_release_date.gte (start of year) for the API
    if (localReleaseYear) {
      const year = String(localReleaseYear).trim();
      if (/^\d{4}$/.test(year))
        params.set("primary_release_date.gte", `${year}-01-01`);
      else params.set("primary_release_date.gte", `${year}-01-01`);
    } else {
      params.delete("primary_release_date.gte");
    }

    // Convert latest year input to primary_release_date.lte (end of year)
    if (localReleaseYearLte) {
      const year = String(localReleaseYearLte).trim();
      if (/^\d{4}$/.test(year))
        params.set("primary_release_date.lte", `${year}-12-31`);
      else params.set("primary_release_date.lte", `${year}-12-31`);
    } else {
      params.delete("primary_release_date.lte");
    }

    if (localLanguage) params.set("with_original_language", localLanguage);
    else params.delete("with_original_language");

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : (pathname ?? "/");
    history.replaceState(null, "", url);
  }

  return (
    <form
      role="search"
      aria-label="Movie filters"
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters();
      }}
      className="w-full pt-6 pb-8 md:pt-12"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="grid w-full grow grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          <Select
            id="sort"
            items={options}
            value={localSort}
            onValueChange={(val: string | null) => setLocalSort(val ?? "")}
            modal={false}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value) =>
                  value
                    ? (options.find((o) => o.value === value)?.label ??
                      "Sort by")
                    : "Sort by"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            id="language"
            items={languageOptions}
            value={localLanguage}
            onValueChange={(val: string | null) => setLocalLanguage(val ?? "")}
            modal={false}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value) =>
                  value
                    ? (languageOptions.find((o) => o.value === value)?.label ??
                      "Select language")
                    : "Select language"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {genres && (
            <Select
              multiple
              id="genres"
              items={genres.map((g) => ({
                value: String(g.id),
                label: g.name ?? "",
              }))}
              value={localGenreIds.map(String)}
              onValueChange={(vals) =>
                setLocalGenreIds(
                  (Array.isArray(vals) ? vals : [vals]).map((v) => Number(v)),
                )
              }
              modal={false}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value) =>
                    value && (Array.isArray(value) ? value.length > 0 : !!value)
                      ? Array.isArray(value)
                        ? value
                            .map((id) => {
                              const genre = genres.find(
                                (g) => g.id === Number(id),
                              );
                              return genre ? genre.name : "";
                            })
                            .join(", ")
                        : (genres.find((g) => g.id === Number(value))?.name ??
                          "")
                      : "Select genres"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {genres.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Popover>
            <PopoverTrigger className="border-input-border bg-input focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-1.5 rounded-full border px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2">
              <span className="text-input-placeholder">More filters</span>
              <ChevronDown className="size-4" />
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="grid grid-cols-2 gap-5">
                <Field id="vote-average" label="Minimum rating (0-10)">
                  <Input
                    id="vote-average"
                    type="number"
                    min={0}
                    max={10}
                    value={localVoteAverage}
                    placeholder="0"
                    onChange={(e) => setLocalVoteAverage(e.target.value || "")}
                    className="input"
                    aria-label="Minimum rating out of 10"
                  />
                </Field>
                <Field id="vote-count" label="Minimum votes">
                  <Input
                    id="vote-count"
                    type="number"
                    min={0}
                    value={localVoteCount}
                    onChange={(e) => setLocalVoteCount(e.target.value || "")}
                    placeholder="0"
                    className="input"
                    aria-label="Minimum number of votes"
                  />
                </Field>
                <Field id="release-year" label="Earliest release year">
                  <Input
                    id="release-year"
                    type="number"
                    min={1800}
                    max={3000}
                    value={localReleaseYear}
                    onChange={(e) => setLocalReleaseYear(e.target.value || "")}
                    placeholder="e.g. 2000"
                    className="input"
                    aria-label="Earliest release year (year only)"
                  />
                </Field>
                <Field id="release-year-lte" label="Latest release year">
                  <Input
                    id="release-year-lte"
                    type="number"
                    min={1800}
                    max={3000}
                    value={localReleaseYearLte}
                    onChange={(e) =>
                      setLocalReleaseYearLte(e.target.value || "")
                    }
                    placeholder="e.g. 2023"
                    className="input"
                    aria-label="Latest release year (year only)"
                  />
                </Field>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2">
          <Button type="submit">Apply filters</Button>

          <Button
            type="reset"
            variant="outline"
            onClick={resetFilters}
            aria-label="Reset all filters to default values"
          >
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}

export function FiltersShell() {
  const pathname = usePathname();
  const options = pathname?.includes("/discover/tv") ? tvOptions : movieOptions;

  return (
    <form
      role="search"
      aria-label="Movie filters"
      className="w-full pt-6 pb-8 md:pt-12"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="grid w-full grow grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          <Select id="sort" items={options} onValueChange={() => {}}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value) =>
                  value
                    ? (options.find((o) => o.value === value)?.label ??
                      "Sort by")
                    : "Sort by"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            id="language"
            items={languageOptions}
            onValueChange={() => {}}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value) =>
                  value
                    ? (languageOptions.find((o) => o.value === value)?.label ??
                      "Select language")
                    : "Select language"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select multiple id="genres" items={[]} onValueChange={() => {}}>
            <SelectTrigger className="w-full">
              <SelectValue>{() => "Select genres"}</SelectValue>
            </SelectTrigger>
            <SelectContent>{/* no items in shell */}</SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger className="border-input-border bg-input focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-1.5 rounded-full border px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2">
              <span className="text-input-placeholder">More filters</span>
              <ChevronDown className="size-4" />
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="grid grid-cols-2 gap-5">
                <Field id="vote-average" label="Minimum rating (0-10)">
                  <Input
                    id="vote-average"
                    type="number"
                    min={0}
                    max={10}
                    placeholder="0"
                    className="input"
                    aria-label="Minimum rating out of 10"
                    disabled
                  />
                </Field>
                <Field id="vote-count" label="Minimum votes">
                  <Input
                    id="vote-count"
                    type="number"
                    min={0}
                    placeholder="0"
                    className="input"
                    aria-label="Minimum number of votes"
                    disabled
                  />
                </Field>
                <Field id="release-year" label="Earliest release year">
                  <Input
                    id="release-year"
                    type="number"
                    min={1800}
                    max={3000}
                    placeholder="e.g. 2000"
                    className="input"
                    aria-label="Earliest release year (year only)"
                    disabled
                  />
                </Field>
                <Field id="release-year-lte" label="Latest release year">
                  <Input
                    id="release-year-lte"
                    type="number"
                    min={1800}
                    max={3000}
                    placeholder="e.g. 2023"
                    className="input"
                    aria-label="Latest release year (year only)"
                    disabled
                  />
                </Field>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2">
          <Button type="submit">Apply filters</Button>

          <Button
            type="reset"
            variant="outline"
            aria-label="Reset all filters to default values"
          >
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}
