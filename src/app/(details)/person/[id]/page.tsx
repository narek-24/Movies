import CreditsExplorer from "../_components/credits";
import { formatDate, processCredits } from "@/lib/utils";
import { type Metadata } from "next";
import { FileImage } from "lucide-react";
import { notFound } from "next/navigation";
import { cache } from "react";
import { tmdb } from "@/lib/api";
import BioExpandable from "../_components/bio-expandable";
import PersonImages from "../_components/images";
import SocialLinks from "../_components/social-links";
import TMDBImage from "@/components/tmdb-image";

export const revalidate = 604800;

const getPersonData = cache(async (id: string) => {
  const { data } = await tmdb.GET("/3/person/{person_id}", {
    params: {
      path: { person_id: Number(id) },
      query: {
        append_to_response: "external_ids,combined_credits,images",
      },
    },
    next: { revalidate: 604800 },
  });

  return data as typeof data & {
    external_ids?: ApiResponse<"/3/person/{person_id}/external_ids">;
    combined_credits?: ApiResponse<"/3/person/{person_id}/combined_credits">;
    images?: ApiResponse<"/3/person/{person_id}/images">;
  };
});

export async function generateMetadata({
  params,
}: PageProps<"/person/[id]">): Promise<Metadata> {
  const { id } = await params;
  const person = await getPersonData(id);

  if (!person) {
    return {};
  }

  const profileImage = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : undefined;

  const birthInfo = person.place_of_birth
    ? `Born in ${person.place_of_birth}`
    : person.birthday
      ? `Born ${formatDate(person.birthday)}`
      : "Person details";

  const description = person.biography
    ? person.biography.slice(0, 160)
    : `${person.name} - ${birthInfo}`;

  const professions = [
    ...(person.known_for_department ? [person.known_for_department] : []),
    "actor",
    "actress",
    "director",
    "producer",
  ];

  return {
    title: `${person.name} - Cast & Crew`,
    description,
    keywords: [
      person.name,
      ...professions,
      "filmography",
      "biography",
      person.place_of_birth,
    ]
      .filter(Boolean)
      .join(", "),
    openGraph: {
      title: person.name,
      description: `${birthInfo}${person.biography ? " - " + person.biography.slice(0, 100) : ""}`,
      type: "profile",
      images: profileImage ? [profileImage] : [],
      url: `https://movies-alpha-ruddy.vercel.app/person/${id}`,
    },
    twitter: {
      card: "summary",
      title: person.name,
      description: birthInfo,
      images: profileImage ? [profileImage] : [],
    },
    alternates: {
      canonical: `https://movies-alpha-ruddy.vercel.app/person/${id}`,
    },
  };
}

export default async function PersonDetailsPage({
  params,
}: PageProps<"/person/[id]">) {
  const { id } = await params;
  const person = await getPersonData(id);

  await new Promise((res) => setTimeout(res, 1000));
  if (!person) notFound();

  const credits = processCredits([
    ...(person.combined_credits?.cast ?? []),
    ...(person.combined_credits?.crew ?? []),
  ]);

  return (
    <>
      <section className="relative py-16 md:pt-18 lg:pb-24">
        <div className="absolute inset-0 -z-20 bg-linear-to-r from-slate-600 to-gray-500 opacity-6 dark:opacity-10"></div>
        <div className="to-background absolute inset-0 -z-10 bg-linear-to-b from-transparent via-transparent"></div>

        <div className="container">
          <h1 className="mb-2">{person.name}</h1>
          <p className="text-muted-foreground mb-4 text-sm font-medium">
            {person.place_of_birth ? (
              <>
                Born in{" "}
                <span className="font-medium">{person.place_of_birth}</span>
                {person.birthday && <> — {formatDate(person.birthday)}</>}
              </>
            ) : person.birthday ? (
              <>Born {formatDate(person.birthday)}</>
            ) : (
              "Birth info unavailable"
            )}
            {!!person.deathday && (
              <span className="ml-1 text-rose-700 dark:text-rose-400">
                • Died {formatDate(person.deathday as string)}
              </span>
            )}
          </p>
        </div>
      </section>

      <section className="container mb-16 flex flex-col gap-12 md:flex-row-reverse lg:gap-16">
        <div className="shrink-0 md:w-[270px]">
          <TMDBImage
            path={person.profile_path}
            alt=""
            size="w300"
            width={270}
            height={405}
            loading="eager"
            unoptimized
            className="mb-4 rounded max-md:mx-auto"
            fallback={
              <div className="grid h-[405px] w-[270px] shrink-0 place-content-center rounded bg-black/3 dark:bg-white/5">
                <FileImage className="size-40 text-neutral-300 dark:text-neutral-700" />
              </div>
            }
          />

          <SocialLinks
            external_ids={person.external_ids}
            imdbId={person.imdb_id}
          />
        </div>

        <div className="max-w-full min-w-0 space-y-8 md:grow md:space-y-12">
          <div>
            <h2>Biography</h2>
            {person.biography ? (
              <BioExpandable text={person.biography} />
            ) : (
              <div className="text-muted-foreground h-20 text-sm">
                No biography available
              </div>
            )}
          </div>

          <div>
            <h2>Photos</h2>
            <PersonImages images={person.images} />
          </div>
        </div>
      </section>

      {person.combined_credits && (
        <CreditsExplorer credits={credits} name={person.name} />
      )}
    </>
  );
}
