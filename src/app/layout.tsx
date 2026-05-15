import "./globals.css";
import { type Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import ThemeToggle from "@/components/theme-toggle";
import Providers from "@/components/providers";
import Searchbox from "@/components/searchbox";
import Link from "next/link";

const geistSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Explore Movies & TV Shows | Movies Platform",
  description:
    "Discover thousands of movies and TV shows. Explore trending films, read detailed reviews, and find your next favorite entertainment with comprehensive cast and crew information.",
  keywords:
    "movies, TV shows, films, discover, streaming, entertainment, reviews, cast, crew, trending",
  authors: [{ name: "Movies" }],
  creator: "Movies App",
  publisher: "Movies App",
  robots: {
    index: true,
    follow: true,
    googleBot:
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://movies-alpha-ruddy.vercel.app/",
    siteName: "Movies Platform",
    title: "Explore Movies & TV Shows",
    description:
      "Discover thousands of movies and TV shows with reviews, cast information, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Movies & TV Shows",
    description: "Discover your next favorite movie or TV show",
  },
  alternates: {
    canonical: "https://movies-alpha-ruddy.vercel.app/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{ fontFamily: `${geistSans.style.fontFamily}, sans-serif` }}
        className="flex flex-col"
      >
        <Providers>
          <header className="bg-background fixed top-0 left-0 z-99 flex h-12 w-full items-center border-b shadow/5 dark:shadow-md/25">
            <div className="container flex h-12 items-center justify-between">
              <nav
                className="flex gap-2 text-sm font-semibold md:gap-6"
                aria-label="Main navigation"
              >
                <Link href="/">Home</Link>
                <Link href="/discover/movie">Movies</Link>
                <Link href="/discover/tv">TV Shows</Link>
              </nav>
              <div className="flex gap-1 md:gap-3">
                <Searchbox />
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="isolate grow pt-12">{children}</main>

          <footer className="text-muted-foreground pt-16 pb-12 text-center text-sm font-semibold text-balance">
            © 2026 Movies. All rights reserved. Data provided by TMDB.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
