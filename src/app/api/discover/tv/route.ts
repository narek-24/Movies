import { tmdb } from "@/lib/api";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const paramsObject: Record<string, string> = {};

  req.nextUrl.searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  const tvShows = await getTvShows(paramsObject);

  if (!tvShows) {
    Response.json({}, { status: 500 });
  }

  return Response.json(tvShows, { status: 200 });
}

async function getTvShows(params: Record<string, string>) {
  const res = await tmdb.GET("/3/discover/tv", {
    params: { query: params },
  });

  return res.data;
}

export type DiscoverTvShowsType = Awaited<ReturnType<typeof getTvShows>>;
