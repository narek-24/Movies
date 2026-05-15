import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDollars(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Date(date)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .replace(",", "");
}

export function processCredits<
  T extends { id: number; genre_ids?: number[]; popularity: number },
>(arr: T[]): T[] {
  const map = new Map<number, true>();

  return arr
    .filter((c) => {
      const exists = map.has(c.id);
      map.set(c.id, true);

      const isNotTalkShow =
        !c.genre_ids?.includes(10767) && !c.genre_ids?.includes(10763);

      return !exists && isNotTalkShow;
    })
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
}
