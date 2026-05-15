import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { tmdb } from "@/lib/api";
import { cn } from "@/lib/utils";
import Carousel from "@/components/ui/carousel";
import Image from "next/image";
import Card from "@/components/ui/card";
import Link from "next/link";

export const revalidate = 72000;

export default async function Home() {
  return (
    <>
      <div>
        <div className="relative mb-8 pt-16 pb-14 md:mb-16 md:pt-32 md:pb-24">
          <Image
            alt="Movies platform hero background - Discover thousands of entertainment titles"
            src="https://image.tmdb.org/t/p/w1280/ebyxeBh56QNXxSJgTnmz7fXAlwk.jpg"
            fill
            preload
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-60"
          />
          <div className="to-background absolute inset-0 -z-10 bg-linear-to-b from-transparent"></div>
          <div className="container">
            <h1 className="mb-6 text-4xl text-balance md:text-5xl">
              Welcome. <br />
              <span className="text-xl tracking-tight md:text-3xl">
                Millions of movies, TV shows and people to discover.
              </span>
            </h1>
            <div className="flex flex-col gap-4 max-md:mx-auto max-md:max-w-lg md:flex-row">
              <Link
                href="/discover/movie"
                className={cn(buttonVariants({ size: "lg" }), "px-6")}
              >
                Start exploring
              </Link>
            </div>
          </div>
        </div>

        <div className="container space-y-16 lg:space-y-24">
          <TrendingMovies />
          <GenresList />
          <Popular />
        </div>
      </div>
    </>
  );
}

function GenresList() {
  const genres = [
    {
      label: "Action",
      id: 28,
      image: "https://image.tmdb.org/t/p/w500/cd8YDn7M0lfaHhZdU6MvCDxPalP.jpg",
    },
    {
      label: "Comedy",
      id: 35,
      image: "https://image.tmdb.org/t/p/w500/qdthf9WrRDSaIkGVQGhhJ9pz1hn.jpg",
    },
    {
      label: "Drama",
      id: 18,
      image: "https://image.tmdb.org/t/p/w500/95ckrV6wQgbffurAVmETQ5YKASL.jpg",
    },
    {
      label: "Horror",
      id: 27,
      image: "https://image.tmdb.org/t/p/w500/6zKjoOOb3OZnZuiHtQZn4Kd69Gq.jpg",
    },
    {
      label: "Romance",
      id: 10749,
      image: "https://image.tmdb.org/t/p/w500/xnHVX37XZEp33hhCbYlQFq7ux1J.jpg",
    },
    {
      label: "Science Ficton",
      id: 878,
      image: "https://image.tmdb.org/t/p/w500/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    },
  ];

  return (
    <section aria-describedby="find">
      <h2 id="find">Find your favourite</h2>
      <nav
        aria-label="Discover movies by genre"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
      >
        {genres.map((genre) => (
          <Link
            key={genre.label}
            href={`/discover/movie?with_genres=${genre.id}`}
            className="group relative"
          >
            <span className="bg-muted relative block h-52 w-full overflow-hidden rounded">
              <Image
                alt={genre.label}
                src={genre.image}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                className="z-1 object-cover transition-transform duration-300 group-hover:scale-103"
              />
              <span className="absolute inset-0 z-2 bg-black/50 transition-colors duration-200 group-hover:bg-black/40"></span>
            </span>
            <span className="absolute top-1/2 left-1/2 z-3 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold tracking-wide whitespace-nowrap text-white text-shadow-sm/40">
              {genre.label}
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}

async function TrendingMovies() {
  const [dayPromise, weekPromise] = await Promise.allSettled([
    tmdb.GET("/3/trending/movie/{time_window}", {
      params: { path: { time_window: "day" } },
    }),
    tmdb.GET("/3/trending/movie/{time_window}", {
      params: { path: { time_window: "week" } },
    }),
  ]);

  if (dayPromise.status === "rejected" && weekPromise.status === "rejected") {
    return null;
  }

  return (
    <section aria-describedby="trending">
      <Tabs defaultValue="day">
        <div className="flex items-center gap-5 md:gap-10">
          <h2 id="trending" className="mb-0">
            Trending{" "}
          </h2>
          <TabsList>
            {dayPromise.status === "fulfilled" && dayPromise.value.data && (
              <TabsTrigger value="day">Today</TabsTrigger>
            )}
            {weekPromise.status === "fulfilled" && weekPromise.value.data && (
              <TabsTrigger value="week">This week</TabsTrigger>
            )}
          </TabsList>
        </div>

        {dayPromise.status === "fulfilled" && dayPromise.value.data && (
          <TabsContent value="day">
            <Carousel>
              {dayPromise.value.data.results?.map((movie, i) => (
                <Card key={`${movie.id}-${i}`}>
                  <Card.Image path={movie.poster_path} />
                  <Card.Title title={movie.title} href={`/movie/${movie.id}`} />
                  <Card.Info
                    rating={movie.vote_average}
                    year={movie.release_date}
                  />
                </Card>
              ))}
            </Carousel>
          </TabsContent>
        )}

        {weekPromise.status === "fulfilled" && weekPromise.value.data && (
          <TabsContent value="week">
            <Carousel>
              {weekPromise.value.data.results?.map((movie, i) => (
                <Card key={`${movie.id}-${i}`}>
                  <Card.Image path={movie.poster_path} />
                  <Card.Title title={movie.title} href={`/movie/${movie.id}`} />
                  <Card.Info
                    rating={movie.vote_average}
                    year={movie.release_date}
                  />
                </Card>
              ))}
            </Carousel>
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}

async function Popular() {
  const [moviePromise, tvPromise] = await Promise.allSettled([
    tmdb.GET("/3/movie/popular"),
    tmdb.GET("/3/tv/popular"),
  ]);

  if (moviePromise.status === "rejected" && tvPromise.status === "rejected") {
    return null;
  }

  return (
    <section aria-describedby="popular">
      <Tabs defaultValue="day">
        <div className="flex items-center gap-5 md:gap-10">
          <h2 id="popular" className="mb-0">
            What&apos;s popular
          </h2>
          <TabsList>
            {moviePromise.status === "fulfilled" && moviePromise.value.data && (
              <TabsTrigger value="day">Movies</TabsTrigger>
            )}
            {tvPromise.status === "fulfilled" && tvPromise.value.data && (
              <TabsTrigger value="week">Tv Shows</TabsTrigger>
            )}
          </TabsList>
        </div>

        {moviePromise.status === "fulfilled" && moviePromise.value.data && (
          <TabsContent value="day">
            <Carousel>
              {moviePromise.value.data.results?.map((movie, i) => (
                <Card key={`${movie.id}-${i}`}>
                  <Card.Image path={movie.poster_path} />
                  <Card.Title title={movie.title} href={`/movie/${movie.id}`} />
                  <Card.Info
                    rating={movie.vote_average}
                    year={movie.release_date}
                  />
                </Card>
              ))}
            </Carousel>
          </TabsContent>
        )}

        {tvPromise.status === "fulfilled" && tvPromise.value.data && (
          <TabsContent value="week">
            <Carousel>
              {tvPromise.value.data.results?.map((movie, i) => (
                <Card key={`${movie.id}-${i}`}>
                  <Card.Image path={movie.poster_path} />
                  <Card.Title title={movie.name} href={`/tv/${movie.id}`} />
                  <Card.Info
                    rating={movie.vote_average}
                    year={movie.first_air_date}
                  />
                </Card>
              ))}
            </Carousel>
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
