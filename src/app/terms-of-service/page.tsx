import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: false },
};

const sections: { h: string; body: React.ReactNode }[] = [
  {
    h: "1. Acceptance of Terms",
    body: (
      <p>
        Welcome to PlayCYOA (&quot;we&quot;, &quot;the Service&quot;), an
        interactive fiction platform operated by JIANG, JUNLIN, an individual
        operator, accessible at https://playcyoa.com. By using the Service or
        purchasing credits you confirm that you are at least 18 years old,
        have read and agree to these Terms, and agree to our{" "}
        <Link href="/privacy-policy" className="text-accent underline">
          Privacy Policy
        </Link>
        . If you do not agree, please stop using the Service. Continued use
        after an update constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    h: "2. The Service",
    body: (
      <p>
        PlayCYOA provides interactive choose-your-own-adventure stories in
        which each choice renders an AI-generated video scene. The Service is
        a digital, intangible product delivered over the internet. Pre-made
        adventures are free; custom scene generation consumes purchased
        credits. The Service relies on third-party AI model providers for
        scene generation, and availability may be affected by those providers.
      </p>
    ),
  },
  {
    h: "3. Accounts",
    body: (
      <p>
        No account is required to play pre-made adventures. Purchases are
        identified by the email address you provide at checkout; keep it
        accurate, as it is how we associate your credits.
      </p>
    ),
  },
  {
    h: "4. Credits & Billing",
    body: (
      <>
        <p className="mb-3">
          Credits are sold in packs (e.g., 30 credits). One credit is consumed
          each time you generate a new custom story scene. Credits do not
          expire and are tied to the email used at purchase.
        </p>
        <p>
          Payments are processed by{" "}
          <strong className="text-gray-200">Waffo Pancake</strong>, our
          merchant of record, which is the legal seller of your purchase and
          handles taxes and card processing. Prices are shown at checkout
          before you pay.
        </p>
      </>
    ),
  },
  {
    h: "5. Refund Policy",
    body: (
      <p>
        Unused credits are refundable within 14 days of purchase — contact
        lelea031210@gmail.com and we will refund the unused portion to the
        original payment method. Credits already consumed, and scenes already
        generated, are non-refundable due to the instant digital nature of the
        Service. This policy is also shown at checkout.
      </p>
    ),
  },
  {
    h: "6. Usage Limits & Fair Use",
    body: (
      <p>
        Free generation is subject to daily quotas to keep the Service
        available and affordable for everyone. We may rate-limit, suspend, or
        refuse generation that is abusive, automated, or intended to exploit
        the Service (e.g., reselling generated scenes or using the site as a
        general-purpose video generator).
      </p>
    ),
  },
  {
    h: "7. Billing Disputes",
    body: (
      <p>
        If you believe a charge is incorrect, contact lelea031210@gmail.com
        before opening a dispute with your bank. We respond within 2 business
        days and resolve confirmed billing errors within 5 business days.
      </p>
    ),
  },
  {
    h: "8. AI Content & Intellectual Property",
    body: (
      <>
        <p className="mb-3">
          Scenes generated from your prompts are yours to keep and share for
          personal, non-commercial use. You grant us a limited, non-exclusive
          license to process your prompts solely to provide the Service. We do
          not use your inputs to train AI models.
        </p>
        <p>
          AI-generated content may contain errors or artifacts. Do not rely on
          it for legal, medical, financial, or other professional purposes.
        </p>
      </>
    ),
  },
  {
    h: "9. Acceptable Use",
    body: (
      <>
        <p className="mb-3">You agree not to use the Service to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>generate illegal, defamatory, harassing, or fraudulent content;</li>
          <li>
            create deepfakes or AI-generated media impersonating real
            individuals or intended to deceive;
          </li>
          <li>generate sexualized content involving minors;</li>
          <li>infringe third-party intellectual property or privacy rights;</li>
          <li>
            scrape, extract, or collect generated content at scale for purposes
            beyond personal use, or to train a competing AI model;
          </li>
          <li>
            bypass or interfere with security features, quotas, or rate limits;
          </li>
          <li>resell access to the Service without written approval.</li>
        </ul>
      </>
    ),
  },
  {
    h: "10. Disclaimers & Limitation of Liability",
    body: (
      <p>
        The Service is provided &quot;as is&quot; without warranties of any
        kind, including merchantability, fitness for a purpose, or accuracy of
        AI output. To the maximum extent permitted by law, our total liability
        is limited to the amount you paid us in the 12 months preceding the
        claim.
      </p>
    ),
  },
  {
    h: "11. Term & Termination",
    body: (
      <p>
        These Terms apply while you use the Service. We may suspend access for
        material breach or suspected fraud. If we terminate the Service for
        reasons unrelated to your breach, we will refund prepaid unused
        credits.
      </p>
    ),
  },
  {
    h: "12. Governing Law & Contact",
    body: (
      <p>
        These Terms are governed by applicable law in the operator&apos;s
        jurisdiction. Before filing any formal proceeding, email
        lelea031210@gmail.com to attempt informal resolution. We may update
        these Terms with at least 14 days&apos; notice for material changes.
        Questions: lelea031210@gmail.com.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-gray-400">
      <h1 className="mb-2 text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mb-8 text-sm">
        Last updated: September 14, 2026 · Version 1.0
      </p>
      {sections.map((s) => (
        <section key={s.h} className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-200">{s.h}</h2>
          <div className="text-sm leading-relaxed">{s.body}</div>
        </section>
      ))}
    </div>
  );
}
