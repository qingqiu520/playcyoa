/** Keep production canonical URLs aligned with the existing www redirect. */
export function getSiteUrl(configured = process.env.NEXT_PUBLIC_SITE_URL): string {
  const url = new URL(configured?.trim() || "https://www.playcyoa.com");
  if (!url.port && ["playcyoa.com", "www.playcyoa.com"].includes(url.hostname)) {
    return "https://www.playcyoa.com";
  }
  // Preserve explicitly configured preview/local origins; never leak a path.
  return url.origin;
}
