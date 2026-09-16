import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { GENRES } from "~/lib/genres";

const inter = Inter({ subsets: ["latin"] });
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.playcyoa.com";
const NAME = process.env.NEXT_PUBLIC_WEBSITE_NAME || "PlayCYOA";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${NAME} — AI Choose Your Own Adventure with Generated Video`,
    template: `%s | ${NAME}`,
  },
  description:
    "Play AI choose your own adventure stories where every choice becomes a generated video scene. Free to play in your browser — horror, sci-fi, romance, fantasy and mystery.",
  openGraph: {
    siteName: NAME,
    type: "website",
    url: SITE,
  },
  verification: {
    google: "mjiWPzLoqQ2fJvWbXSbyfHeyQP328DMf3ncPguZMtMA",
  },
  other: {
    "waffo-verify": "a8269b6e4f2dadaf3f3e0ae016279209",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: NAME,
    url: SITE,
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "AI choose your own adventure: interactive stories where each choice generates the next cinematic video scene.",
  };
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3730679836569586"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <header className="border-b border-edge">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-white">
              {NAME}
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              {GENRES.map((g) => (
                <Link
                  key={g.slug}
                  href={`/adventures/${g.slug}`}
                  className="hidden hover:text-accent md:inline"
                >
                  {g.name}
                </Link>
              ))}
              <Link href="/play" className="btn-primary !px-4 !py-1.5 text-sm">
                Create your story
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-edge py-8 text-center text-sm text-gray-500">
          <div className="mb-2 flex justify-center gap-6">
            <Link href="/pricing" className="hover:text-gray-300">Pricing</Link>
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href="/privacy-policy" className="hover:text-gray-300">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-gray-300">Terms</Link>
            <a href="mailto:lelea031210@gmail.com" className="hover:text-gray-300">
              Contact
            </a>
          </div>
          <p>© {new Date().getFullYear()} {NAME} — an AI choose your own adventure site</p>
        </footer>
      </body>
    </html>
  );
}

