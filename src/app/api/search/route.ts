import { tmdb } from "@/lib/api";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  if (typeof q !== "string") {
    return Response.json({}, { status: 400 });
  }

  const res = await tmdb.GET("/3/search/multi", {
    params: { query: { query: q, include_adult: true } },
  });

  const results = res.data?.results;

  if (!results) {
    Response.json({}, { status: 500 });
    return;
  }

  return Response.json(results, { status: 200 });
}

export type SearchResultsType = {
  media_type: "movie" | "tv" | "person";
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
}[];
