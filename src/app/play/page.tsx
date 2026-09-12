import type { Metadata } from "next";
import Player from "~/components/Player";

export const metadata: Metadata = {
  title: "Create Your Own AI Adventure",
  description:
    "Describe an opening and play your own AI choose your own adventure — every choice generates the next video scene.",
  robots: { index: false }, // 工具页不给收录，收录位留给故事页和题材页
};

export default async function PlayCustom({
  searchParams,
}: {
  searchParams: Promise<{ premise?: string }>;
}) {
  const { premise } = await searchParams;
  const p = premise || "A door appears where no door should be";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold text-white">
        Your story
      </h1>
      <Player customPremise={p} />
    </div>
  );
}
