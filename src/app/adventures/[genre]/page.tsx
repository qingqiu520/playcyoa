import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GENRES, getGenre } from "~/lib/genres";
import { storiesByGenre } from "~/lib/stories";
import StartForm from "~/components/StartForm";

export function generateStaticParams() {
  return GENRES.map((g) => ({ genre: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ genre: string }>;
}): Promise<Metadata> {
  const { genre } = await params;
  const g = getGenre(genre);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/adventures/${g.slug}` },
  };
}

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genre: string }>;
}) {
  const { genre } = await params;
  const g = getGenre(genre);
  if (!g) notFound();
  const stories = storiesByGenre(g.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-4 text-4xl font-bold text-white">{g.h1}</h1>
      <p className="mb-8 max-w-2xl text-lg text-gray-400">{g.intro}</p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s) => (
          <Link key={s.slug} href={`/play/${s.slug}`} className="card block p-5">
            <h2 className="mb-1 text-lg font-semibold text-white">{s.title}</h2>
            <p className="line-clamp-2 text-sm text-gray-400">{s.description}</p>
          </Link>
        ))}
        {stories.length === 0 && (
          <p className="text-gray-500">
            New {g.name.toLowerCase()} adventures are being generated — or start
            your own below.
          </p>
        )}
      </div>

      <div className="mt-12 border-t border-edge pt-10 text-center">
        <h2 className="mb-2 text-xl font-semibold text-white">
          Write your own {g.name.toLowerCase()} adventure
        </h2>
        <p className="mb-6 text-gray-400">
          Describe the opening — the AI generates every next scene around your
          choices.
        </p>
        <StartForm />
      </div>
    </div>
  );
}
