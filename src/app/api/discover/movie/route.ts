import { tmdb } from "@/lib/api";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const paramsObject: Record<string, string> = {};

  req.nextUrl.searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  const movies = await getMovies(paramsObject);

  if (!movies) {
    Response.json({}, { status: 500 });
  }

  return Response.json(movies, { status: 200 });
}

async function getMovies(params: Record<string, string>) {
  const res = await tmdb.GET("/3/discover/movie", {
    params: { query: params },
  });

  return res.data;
}

export type DiscoverMoviesType = Awaited<ReturnType<typeof getMovies>>;
