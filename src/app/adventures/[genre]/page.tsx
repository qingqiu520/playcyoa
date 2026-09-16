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

      <section className="mx-auto mt-14 max-w-3xl text-left">
        <h2 className="mb-4 text-2xl font-bold text-white">
          How {g.name.toLowerCase()} adventures work on PlayCYOA
        </h2>
        <p className="mb-3 text-gray-400">
          Each {g.name.toLowerCase()} adventure is a branching story told in
          generated video scenes. You watch a scene, pick between two choices,
          and the story renders the consequence — different choices lead to
          different scenes and endings, so no two playthroughs are the same.
        </p>
        <p className="mb-3 text-gray-400">
          Our pre-made adventures are free and play instantly. If you'd rather
          set the premise yourself, use the form below: describe the opening of
          your own {g.name.toLowerCase()} story and the AI builds the branch for
          you, one scene at a time.
        </p>
        <div className="mt-6 space-y-3">
          {[
            {
              q: `Are the ${g.name.toLowerCase()} adventures free?`,
              a: "Yes — every pre-made adventure is free with no sign-up. Custom story generation uses credits so we can keep the video pipeline sustainable.",
            },
            {
              q: "Do my choices actually change the story?",
              a: "Yes. Each choice takes you to a different scene in the branching tree — including different endings. Replaying is the point: try the road you didn't take.",
            },
            {
              q: "Are the videos generated live?",
              a: "Public adventures use pre-generated cinematic scenes for instant playback. Custom stories generate scenes on demand with third-party AI video models, moderated by automated safety checks.",
            },
          ].map((f) => (
            <details key={f.q} className="card p-4">
              <summary className="cursor-pointer font-semibold text-gray-100">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-gray-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

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
