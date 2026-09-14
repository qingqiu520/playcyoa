import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false },
};

const sections: { h: string; body: React.ReactNode }[] = [
  {
    h: "1. Data Controller",
    body: (
      <p>
        The data controller for this service is PlayCYOA, operated by [YOUR
        LEGAL NAME], an individual operator. Privacy contact: [YOUR EMAIL]. If
        a section of this policy does not apply to your use, it is because the
        service does not perform that processing.
      </p>
    ),
  },
  {
    h: "2. Information We Collect",
    body: (
      <>
        <p className="mb-3">
          <strong className="text-gray-200">You provide:</strong> story prompts
          you type when creating a custom adventure, and your email address if
          you purchase credits (collected by our payment processor at
          checkout). Do not submit personal or sensitive information inside
          prompts.
        </p>
        <p>
          <strong className="text-gray-200">Collected automatically:</strong>{" "}
          standard server logs (IP address, browser type, pages visited,
          timestamps) and anonymous usage analytics. We do not require an
          account to play pre-made adventures.
        </p>
      </>
    ),
  },
  {
    h: "3. How We Use Information",
    body: (
      <p>
        We use information to operate the service (generating the story scenes
        you request), process purchases, prevent abuse and cost attacks on the
        generation API, and improve content. We do not use your prompts to
        train AI models.
      </p>
    ),
  },
  {
    h: "4. Cookies & Tracking",
    body: (
      <p>
        We use strictly necessary storage only (e.g., to remember your progress
        in an adventure). If advertising is enabled, our ad partner (Google
        AdSense) may set cookies subject to its own policies and the consent
        choices you make. You can disable cookies in your browser; the core
        game will still work.
      </p>
    ),
  },
  {
    h: "5. Sharing & Processors",
    body: (
      <>
        <p className="mb-3">
          We do not sell your personal information. We share data only with the
          processors needed to run the service:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-gray-200">Waffo Pancake</strong> — payment
            processing. Card data is handled exclusively by Waffo Pancake under
            PCI-DSS and is never stored on our servers.
          </li>
          <li>
            <strong className="text-gray-200">AI generation providers</strong> —
            your prompts are sent to third-party AI video/story providers solely
            to generate your requested scenes.
          </li>
          <li>
            <strong className="text-gray-200">Vercel</strong> — hosting and
            content delivery.
          </li>
          <li>
            <strong className="text-gray-200">Google AdSense</strong> — if ads
            are shown (see its privacy policy).
          </li>
        </ul>
      </>
    ),
  },
  {
    h: "6. Data Security & Retention",
    body: (
      <p>
        All traffic is encrypted via HTTPS. We keep server logs for up to 90
        days and purchase records as long as required by tax law. Prompts used
        for generation are not retained beyond what is needed to render your
        session.
      </p>
    ),
  },
  {
    h: "7. Your Rights",
    body: (
      <p>
        Depending on your jurisdiction (including GDPR and CCPA), you may
        request access, correction, deletion, restriction, portability, or
        object to processing of your personal data. Email [YOUR EMAIL] and we
        will respond within 30 days. You may also lodge a complaint with your
        local data protection authority.
      </p>
    ),
  },
  {
    h: "8. International Transfers",
    body: (
      <p>
        Our providers may process data in other countries. Where required, we
        rely on appropriate safeguards such as standard contractual clauses.
      </p>
    ),
  },
  {
    h: "9. Children",
    body: (
      <p>
        The service is intended for users aged 13 and older. We do not
        knowingly collect personal information from children under 13. Contact
        us and we will delete such data promptly.
      </p>
    ),
  },
  {
    h: "10. Changes",
    body: (
      <p>
        We may update this policy; material changes will be announced on this
        page at least 15 days before taking effect, and the date below will be
        updated.
      </p>
    ),
  },
  {
    h: "11. Contact",
    body: (
      <p>
        PlayCYOA — operated by [YOUR LEGAL NAME]. Email: [YOUR EMAIL]. Website:
        https://playcyoa.com
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-gray-400">
      <h1 className="mb-2 text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mb-8 text-sm">Last updated: September 14, 2026</p>
      {sections.map((s) => (
        <section key={s.h} className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-200">{s.h}</h2>
          <div className="text-sm leading-relaxed">{s.body}</div>
        </section>
      ))}
    </div>
  );
}
