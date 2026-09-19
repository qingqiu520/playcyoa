"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessInner() {
  const params = useSearchParams();
  const orderId =
    params.get("orderId") ||
    params.get("order_id") ||
    params.get("order") ||
    params.get("orderUuid") ||
    params.get("order_uuid") ||
    params.get("id") ||
    params.get("sessionId") ||
    params.get("session_id") ||
    "";
  const [manualId, setManualId] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "error">(
    orderId ? "loading" : "error"
  );
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setState("error");
      return;
    }
    let tries = 0;
    const t = setInterval(async () => {
      tries++;
      try {
        const r = await fetch(`/api/credits/order?id=${encodeURIComponent(orderId)}`);
        if (r.ok) {
          const d = await r.json();
          setCode(d.code);
          localStorage.setItem("cyoa_credit_code", d.code);
          setState("ready");
          clearInterval(t);
        }
      } catch {}
      if (tries > 15) {
        setState("error");
        clearInterval(t);
      }
    }, 2000);
    return () => clearInterval(t);
  }, [orderId]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      {state === "loading" && (
        <>
          <h1 className="mb-4 text-3xl font-bold text-white">
            Confirming your payment…
          </h1>
          <p className="text-gray-400">
            We're issuing your credit code — this takes a few seconds.
          </p>
        </>
      )}
      {state === "ready" && (
        <>
          <h1 className="mb-4 text-3xl font-bold text-white">
            🎉 30 credits unlocked
          </h1>
          <p className="mb-6 text-gray-400">
            Your credit code (saved on this device — keep it safe):
          </p>
          <div className="mb-4 rounded-xl border border-accent/50 bg-panel p-4 font-mono text-xl text-accent">
            {code}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopied(true);
            }}
            className="btn-primary mb-8"
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
          <p className="mb-6 text-sm text-gray-500">
            Each custom scene uses 1 credit. You can check your balance anytime
            at <Link href="/credits/redeem" className="text-accent underline">Credits</Link>.
          </p>
          <Link href="/play" className="text-accent underline">
            Start your adventure →
          </Link>
        </>
      )}
      {state === "error" && (
        <>
          <h1 className="mb-4 text-3xl font-bold text-white">
            Almost there…
          </h1>
          <p className="mb-4 text-gray-400">
            Paste your order ID (from your receipt email or the Waffo order
            page) to retrieve your code:
          </p>
          <div className="mb-6 flex justify-center gap-2">
            <input
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Order ID"
              className="input-date w-64 font-mono text-sm"
            />
            <button
              onClick={async () => {
                const r = await fetch(
                  `/api/credits/order?id=${encodeURIComponent(manualId.trim())}`
                );
                if (r.ok) {
                  const d = await r.json();
                  setCode(d.code);
                  localStorage.setItem("cyoa_credit_code", d.code);
                  setState("ready");
                } else {
                  alert("No code found for that order yet — try again in a minute.");
                }
              }}
              className="btn-primary text-sm"
            >
              Get my code
            </button>
          </div>
          <p className="mb-6 text-sm text-gray-500">
            Still stuck? Email us at{" "}
            <a href="mailto:lelea031210@gmail.com" className="text-accent underline">
              lelea031210@gmail.com
            </a>{" "}
            with your receipt and we'll send it manually.
          </p>
        </>
      )}
    </div>
  );
}

export default function CreditsSuccess() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-400">Loading…</div>}>
      <SuccessInner />
    </Suspense>
  );
}
