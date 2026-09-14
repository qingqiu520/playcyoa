import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "PlayCYOA pricing — free pre-made adventures and story credit packs for custom scene generation.",
};

export default function Pricing() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-3 text-3xl font-bold text-white">Pricing</h1>
      <p className="mb-10 text-gray-400">
        Pre-made adventures are free forever. Credits unlock custom scene
        generation — you describe the premise, and each new scene costs 1
        credit.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-edge p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">Free</h2>
          <p className="mb-4 text-3xl font-bold text-white">
            $0
          </p>
          <ul className="mb-6 space-y-2 text-sm text-gray-400">
            <li>All pre-made adventures, unlimited replay</li>
            <li>Daily free custom-generation quota (shared)</li>
            <li>No account required</li>
          </ul>
          <Link href="/play" className="btn-primary block text-center text-sm">
            Start playing
          </Link>
        </div>

        <div className="rounded-xl border border-accent/40 p-6">
          <h2 className="mb-1 text-lg font-semibold text-white">
            Story Credits — 30 Pack
          </h2>
          <p className="mb-4 text-3xl font-bold text-white">
            $4.99 <span className="text-sm font-normal text-gray-400">one-time</span>
          </p>
          <ul className="mb-6 space-y-2 text-sm text-gray-400">
            <li>30 story credits — 1 credit = 1 generated scene</li>
            <li>~$0.17 per scene</li>
            <li>Credits never expire</li>
            <li>Skip the daily free-quota limit</li>
          </ul>
          <p className="rounded-lg border border-edge px-4 py-2 text-center text-sm text-gray-400">
            Checkout opens soon — payments processed by Waffo Pancake
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-4 text-sm text-gray-400">
        <h2 className="text-lg font-semibold text-white">How credits work</h2>
        <p>
          Each time you generate a new custom scene in your adventure, 1 credit
          is consumed. Unused credits are refundable within 14 days of
          purchase — see our{" "}
          <Link href="/terms-of-service" className="text-accent underline">
            refund policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
