"use client";

import { buttonVariants } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, ExternalLink } from "lucide-react";

interface SocialLinksProps {
  external_ids?: ApiResponse<"/3/person/{person_id}/external_ids">;
  imdbId?: string;
}

interface SocialLink {
  id: string | undefined;
  name: string;
  icon: React.ReactNode;
  url: (id: string) => string;
}

export default function SocialLinks({
  external_ids,
  imdbId,
}: SocialLinksProps) {
  const socialLinks: SocialLink[] = [
    {
      id: external_ids?.instagram_id,
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: (id) => `https://instagram.com/${id}`,
    },
    {
      id: external_ids?.twitter_id,
      name: "X (Twitter)",
      icon: <Twitter className="h-5 w-5" />,
      url: (id) => `https://twitter.com/${id}`,
    },
    {
      id: external_ids?.facebook_id,
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: (id) => `https://facebook.com/${id}`,
    },
    {
      id: external_ids?.tiktok_id,
      name: "TikTok",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      url: (id) => `https://tiktok.com/@${id}`,
    },
    {
      id: imdbId || external_ids?.imdb_id,
      name: "IMDb",
      icon: <ExternalLink className="h-5 w-5" />,
      url: (id) => `https://imdb.com/name/${id}`,
    },
  ];

  const activeLinks = socialLinks.filter((link) => link.id);

  if (activeLinks.length === 0) return null;

  return (
    <div>
      <h3 className="sr-only">Connect</h3>
      <div className="grid grid-cols-2 gap-3">
        {activeLinks.map((link) => (
          <a
            key={link.name}
            href={link.url(link.id!)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            {link.icon}
            <span className="text-sm font-semibold">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
