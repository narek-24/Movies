import { type paths } from "@/types/tmdb";
import createClient from "openapi-fetch";

export const tmdb = createClient<paths>({
  baseUrl: "https://api.themoviedb.org",
  headers: {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  },
});
