import type { MetadataRoute } from "next";
import { listStories } from "~/lib/stories";
import { GENRES } from "~/lib/genres";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.playcyoa.com";
  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/pricing`, changeFrequency: "monthly", priority: 0.5 },
    ...GENRES.map((g) => ({
      url: `${site}/adventures/${g.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...listStories().map((s) => ({
      url: `${site}/play/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

