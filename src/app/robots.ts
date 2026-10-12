import { getSiteUrl } from "~/lib/site";
﻿import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${site}/sitemap.xml`,
  };
}

