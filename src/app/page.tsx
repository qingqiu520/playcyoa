import Link from "next/link";
import type { Metadata } from "next";
import { listStories } from "~/lib/stories";
import { GENRES } from "~/lib/genres";
import StartForm from "~/components/StartForm";

export const metadata: Metadata = {
  title: "AI Choose Your Own Adventure — Play Interactive Video Stories Free",
  description:
    "The classic choose your own adventure, rebuilt with AI video. Pick a story, make a choice, and watch the next scene generate itself. Free to play in your browser.",
  alternates: { canonical: "/" },
};

const faq = [
  {
    q: "What is an AI choose your own adventure?",
    a: "A story where you decide what happens next — but instead of reading text, each choice generates a short cinematic video scene powered by an AI video model.",
  },
  {
    q: "Is it free to play?",
    a: "Yes. Pre-made adventures are free to play start to finish. Creating custom scenes uses generation credits; free daily credits are available while capacity lasts.",
  },
  {
    q: "How does the video get generated?",
    a: "When you make a choice, our system sends a scene prompt to a real-time AI video model and plays the result in a few seconds — the story literally writes itself in video.",
  },
  {
    q: "Can I write my own story?",
    a: "Yes — describe any opening on the create page, and the AI will generate your first scene plus two choices at every step.",
  },
];

export default function Home() {
  const stories = listStories();
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {/* Hero + 创建入口 */}
      <section className="mx-auto max-w-4xl px-4 pb-8 pt-14 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
          AI Choose Your Own Adventure
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
          Every choice you make becomes a real AI-generated video scene. Pick a
          story below — or write your own opening and let the adventure build
          itself around you.
        </p>
        <StartForm />
      </section>

      {/* 成品故事网格 */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-semibold text-white">
          Play a ready-made adventure
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <Link key={s.slug} href={`/play/${s.slug}`} className="card block p-5">
              <span className="mb-2 inline-block rounded bg-edge px-2 py-0.5 text-xs text-gray-300">
                {s.genre}
              </span>
              <h3 className="mb-1 text-lg font-semibold text-white">{s.title}</h3>
              <p className="line-clamp-2 text-sm text-gray-400">{s.description}</p>
            </Link>
          ))}
          {stories.length === 0 && (
            <p className="text-gray-500">
              Stories are being generated — check back soon, or create your own
              above.
            </p>
          )}
        </div>
      </section>

      {/* 题材入口 */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-4 text-2xl font-semibold text-white">Browse by genre</h2>
        <div className="flex flex-wrap gap-3">
          {GENRES.map((g) => (
            <Link
              key={g.slug}
              href={`/adventures/${g.slug}`}
              className="rounded-full border border-edge px-4 py-2 text-sm text-gray-300 hover:border-accent hover:text-accent"
            >
              {g.name} adventures
            </Link>
          ))}
        </div>
      </section>

      {/* SEO 正文 */}
      <section className="mx-auto max-w-3xl px-4 py-10 text-gray-400">
        <h2 className="mb-3 text-2xl font-semibold text-white">
          A choose your own adventure that draws itself
        </h2>
        <p className="mb-4">
          The branching paperbacks you grew up with had three endings and
          somebody else wrote all of them. {process.env.NEXT_PUBLIC_WEBSITE_NAME}{" "}
          is different: an AI video model renders the next scene around what you
          actually choose. Heist, throne, time loop, first contact — pick a
          premise, or bring your own.
        </p>
        <p className="mb-4">
          Each scene ends with a choice. Tap one and the story bends around it —
          generated in seconds, not written in advance. No two playthroughs are
          the same, because the next clip is created the moment you choose it.
        </p>
        <h3 className="mb-3 mt-8 text-xl font-semibold text-white">How it works</h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Pick a ready-made adventure or describe your own opening.</li>
          <li>Watch the AI-generated opening scene.</li>
          <li>Choose what happens next — the next scene is generated for you.</li>
          <li>Keep choosing until your story reaches its ending.</li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="mb-4 text-2xl font-semibold text-white">FAQ</h2>
        <div className="space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="card p-4">
              <summary className="cursor-pointer font-medium text-white">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-gray-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
