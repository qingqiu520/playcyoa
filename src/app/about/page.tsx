import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About PlayCYOA",
  description:
    "About PlayCYOA — an interactive fiction platform where every choice in a story is rendered as a cinematic AI-generated video scene.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold text-white">About PlayCYOA</h1>
      <div className="space-y-4 text-gray-300">
        <p>
          PlayCYOA is an interactive fiction platform that turns the classic
          choose-your-own-adventure format into something visual: every choice
          you make renders the next scene as a short cinematic video.
        </p>
        <p>
          Our public adventures are hand-crafted branching story trees with
          pre-generated video scenes — free to play, no sign-up required. The
          custom mode lets you describe your own story and generates scenes on
          demand.
        </p>
        <p>
          All scenes are generated with third-party AI video models. Stories are
          fiction; generated content is moderated by automated safety systems
          before rendering.
        </p>
        <p>
          Questions, feedback, or partnership inquiries:{" "}
          <a
            href="mailto:lelea031210@gmail.com"
            className="text-accent underline"
          >
            lelea031210@gmail.com
          </a>
        </p>
        <p>
          <Link href="/" className="text-accent underline">
            Start an adventure →
          </Link>
        </p>
      </div>
    </div>
  );
}
