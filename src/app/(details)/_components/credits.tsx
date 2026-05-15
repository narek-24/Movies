"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Carousel from "@/components/ui/carousel";
import Card from "@/components/ui/card";

interface Props {
  credits?: ApiResponse<"/3/tv/{series_id}/credits">;
}

export default function Credits({ credits }: Props) {
  if (!credits) return null;

  const cast = credits?.cast
    ?.sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);

  const crew = credits?.crew
    ?.sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);

  const hasCast = Array.isArray(cast) && cast.length > 0;
  const hasCrew = Array.isArray(crew) && crew.length > 0;

  if (!hasCast && !hasCrew) return null;

  const defaultTab = hasCast ? "cast" : "crew";

  return (
    <section aria-labelledby="credits">
      <Tabs defaultValue={defaultTab}>
        <div className="flex items-center gap-10">
          <h2 id="credits" className="mb-0">
            Credits
          </h2>
          <TabsList>
            {hasCast && <TabsTrigger value="cast">Cast</TabsTrigger>}
            {hasCrew && <TabsTrigger value="crew">Crew</TabsTrigger>}
          </TabsList>
        </div>
        {hasCast && (
          <TabsContent value="cast">
            <Carousel>
              {cast!.map((castMember, i) => (
                <Card key={i}>
                  <Card.Image path={castMember.profile_path} />
                  <Card.Title
                    title={castMember.name}
                    href={`/person/${castMember.id}`}
                  />
                  <Card.Character character={castMember.character} />
                </Card>
              ))}
            </Carousel>
          </TabsContent>
        )}
        {hasCrew && (
          <TabsContent value="crew">
            <Carousel>
              {crew!.map((crewMember, i) => (
                <Card key={i}>
                  <Card.Image path={crewMember.profile_path} />
                  <Card.Title
                    title={crewMember.name}
                    href={`/person/${crewMember.id}`}
                  />
                  <Card.Character character={crewMember.job} />
                </Card>
              ))}
            </Carousel>
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
