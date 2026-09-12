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
    </div>
  );
}
