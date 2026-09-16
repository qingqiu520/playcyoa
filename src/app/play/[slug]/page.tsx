import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Player from "~/components/Player";
import { getStory, listStories } from "~/lib/stories";

export function generateStaticParams() {
  return listStories().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  return {
    title: `${story.title} — AI ${story.genre} adventure`,
    description: story.description,
    alternates: { canonical: `/play/${story.slug}` },
  };
}

export default async function PlayStory({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const sceneCount = Object.keys(story.nodes).length;
  const endingCount = Object.values(story.nodes).filter(
    (n) => n.choices.length === 0
  ).length;
  const faqs = [
    {
      q: `What is "${story.title}" about?`,
      a: story.description,
    },
    {
      q: `How many endings does ${story.title} have?`,
      a: `This adventure has ${sceneCount} generated video scenes and ${endingCount} different endings. Your choices decide which scenes and ending you reach — replay it to see the paths you missed.`,
    },
    {
      q: "Is this adventure free to play?",
      a: "Yes. Every public adventure on PlayCYOA is free — no sign-up, no download. Press play and choose.",
    },
    {
      q: "How are the scenes made?",
      a: "Each scene is a short cinematic video generated with AI video models, then assembled into a branching story tree you navigate by making choices.",
    },
  ];
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="mb-2 text-center text-sm uppercase tracking-wide text-gray-500">
        {story.genre} adventure
      </p>
      <h1 className="mb-8 text-center text-3xl font-bold text-white">
        {story.title}
      </h1>
      <Player story={story} />
      <p className="mx-auto mt-8 max-w-2xl text-center text-gray-400">
        {story.description}
      </p>

      <section className="mx-auto mt-10 max-w-2xl text-left">
        <h2 className="mb-3 text-xl font-bold text-white">How this adventure works</h2>
        <p className="mb-3 text-gray-400">
          {story.title} is a branching {story.genre} story told in{" "}
          {sceneCount} generated video scenes with {endingCount} different
          endings. After each scene you pick one of two choices — the story
          branches to the scene your choice leads to. There is no single correct
          path: different decisions reach different endings, so a second
          playthrough can end somewhere entirely new.
        </p>
        <p className="text-gray-400">
          This is one of PlayCYOA's hand-crafted adventures: the story tree and
          every video scene were created in advance, so it plays instantly and
          free.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-2xl text-left">
        <h2 className="mb-4 text-xl font-bold text-white">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card p-4">
              <summary className="cursor-pointer font-semibold text-gray-100">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-gray-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
