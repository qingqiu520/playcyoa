import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false },
};

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-gray-400">
      <h1 className="mb-6 text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mb-4">
        {process.env.NEXT_PUBLIC_WEBSITE_NAME} does not require an account to
        play pre-made adventures. We do not collect personal information beyond
        standard server logs and anonymous usage analytics.
      </p>
      <p className="mb-4">
        Story prompts you submit are sent to third-party AI providers solely to
        generate your requested scenes. Do not submit personal or sensitive
        information in prompts.
      </p>
      <p>
        Questions: contact us via the email listed on this site's footer pages.
      </p>
    </div>
  );
}
