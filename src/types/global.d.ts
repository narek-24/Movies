import { type paths } from "@/types/tmdb";

export {};

declare global {
  type ApiResponse<T extends keyof paths> =
    paths[T]["get"]["responses"]["200"]["content"]["application/json"];
}
