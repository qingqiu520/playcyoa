"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CreditsRedeem() {
  const [code, setCode] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cyoa_credit_code");
    if (saved) {
      setCode(saved);
      check(saved);
    }
  }, []);

  async function check(c: string) {
    setMsg("");
    const r = await fetch(`/api/credits/balance?code=${encodeURIComponent(c)}`);
    if (r.ok) {
      const d = await r.json();
      setBalance(d.balance);
      localStorage.setItem("cyoa_credit_code", c.toUpperCase().trim());
    } else {
      setBalance(null);
      setMsg("That code doesn't look right — check it and try again.");
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold text-white">Your credits</h1>
      <p className="mb-8 text-gray-400">
        Enter a credit code to load it on this device and check its balance.
      </p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CYOA-XXXX-XXXX"
          className="input-date flex-1 font-mono"
        />
        <button onClick={() => check(code)} className="btn-primary">
          Check
        </button>
      </div>
      {balance !== null && (
        <div className="card mt-6 p-5 text-center">
          <p className="text-sm text-gray-400">Remaining credits</p>
          <p className="text-4xl font-bold text-accent">{balance}</p>
          {balance === 0 && (
            <Link href="/pricing" className="mt-3 inline-block text-sm text-accent underline">
              Buy more credits →
            </Link>
          )}
        </div>
      )}
      {msg && <p className="mt-4 text-sm text-red-400">{msg}</p>}
    </div>
  );
}
