import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: false },
};

export default function Terms() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-gray-400">
      <h1 className="mb-6 text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mb-4">
        {process.env.NEXT_PUBLIC_WEBSITE_NAME} provides AI-generated interactive
        stories for entertainment. Generated scenes are produced by third-party
        AI models and may be imperfect or unpredictable.
      </p>
      <p className="mb-4">
        You may not use this service to generate illegal, harmful, or infringing
        content. We may rate-limit or refuse generation at our discretion to
        keep the service available for everyone.
      </p>
      <p>
        The service is provided "as is" without warranties of any kind.
      </p>
    </div>
  );
}
