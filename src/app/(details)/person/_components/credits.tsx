"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Card from "@/components/ui/card";

interface CreditsExplorerProps {
  credits?: any[];
  name?: string;
}

export default function CreditsExplorer({
  credits,
  name,
}: CreditsExplorerProps) {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [creditsType, setCreditsType] = useState<string | null>(null);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string | null>(null);

  const filteredAndSortedCredits = useMemo(() => {
    let allCredits: any[];

    if (creditsType === null) {
      allCredits = credits ?? [];
    } else if (creditsType === "cast") {
      allCredits = credits?.filter((c) => c.character) ?? [];
    } else {
      allCredits = credits?.filter((c) => c.job) ?? [];
    }

    if (searchQuery) {
      allCredits = allCredits.filter(
        (credit) =>
          credit.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          credit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          credit.department?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (mediaTypeFilter) {
      allCredits = allCredits.filter(
        (credit) => credit.media_type === mediaTypeFilter,
      );
    }

    switch (sortBy) {
      case "latest":
        allCredits.sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date).getTime();
          const dateB = new Date(b.release_date || b.first_air_date).getTime();
          return dateB - dateA;
        });
        break;
      case "oldest":
        allCredits.sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date).getTime();
          const dateB = new Date(b.release_date || b.first_air_date).getTime();
          return dateA - dateB;
        });
        break;
      case "rating":
        allCredits.sort(
          (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
        );
        break;
      default:
        allCredits.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }

    return allCredits;
  }, [credits, searchQuery, sortBy, mediaTypeFilter, creditsType]);

  if (!credits || credits.length === 0) return null;

  return (
    <section
      aria-labelledby="credits"
      className="container mb-8 gap-6 space-y-4 max-md:-mt-6! md:flex-row md:gap-12"
    >
      <div className="mb-6">
        <h2 id="credits" className="mb-0">
          {name ? `${name}'s Credits` : "Credits"}
        </h2>

        <p className="text-muted-foreground">
          Browse acting and crew credits across movies and TV — filter and sort
          to find specific roles.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <div className="relative col-span-2 md:col-span-3 lg:col-span-2">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            id="search"
            type="text"
            placeholder="Search by title or role..."
            value={searchQuery}
            aria-label="Search by title or role"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-4 pl-10"
          />
        </div>

        {/* Credits Type Filter */}
        <Select
          id="credit-type"
          value={creditsType}
          onValueChange={(val: string | null) => setCreditsType(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {(value: string | null) =>
                value ? (
                  <span className="capitalize">{value}</span>
                ) : (
                  "Select credit"
                )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Credits</SelectItem>
            <SelectItem value="cast">Acting</SelectItem>
            <SelectItem value="crew">Production</SelectItem>
          </SelectContent>
        </Select>

        <Select
          id="media-type"
          value={mediaTypeFilter}
          onValueChange={(val: string | null) => setMediaTypeFilter(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {(value: string | null) =>
                value ? (
                  <span className="capitalize">{value}</span>
                ) : (
                  "All Types"
                )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Types</SelectItem>
            <SelectItem value="movie">Movies</SelectItem>
            <SelectItem value="tv">TV Shows</SelectItem>
          </SelectContent>
        </Select>

        <Select
          id="sort"
          value={sortBy}
          onValueChange={(val: string | null) => setSortBy(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {(value: string | null) =>
                value ? <span className="capitalize">{value}</span> : "Sort by"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Popularity</SelectItem>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedCredits.length === 0 && (
        <p className="text-muted-foreground pt-6 pb-16 text-center font-medium">
          No credits found matching your filters.
        </p>
      )}

      <ul className="discover-grid" aria-label="Credits list">
        {filteredAndSortedCredits.map((item, i) => (
          <Card key={`${item.id}-${i}`}>
            <Card.Image path={item.poster_path} />
            <Card.Title
              title={item.title || item.name}
              href={`/${item.media_type}/${item.id}`}
            />
            <Card.Character character={item.character || item.department} />
          </Card>
        ))}
      </ul>
    </section>
  );
}
