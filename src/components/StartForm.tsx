"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const IDEAS = [
  "A heist in a city of canals, at dawn",
  "You inherit a manor — and the eight staff who never leave",
  "A distress signal from a ship that sank fifty years ago",
  "Your wedding day, in a time loop",
];

export default function StartForm() {
  const router = useRouter();
  const [text, setText] = useState("");

  const go = (prompt: string) => {
    if (!prompt.trim()) return;
    router.push(`/play?premise=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(text);
        }}
        className="overflow-hidden rounded-2xl border border-edge bg-panel"
      >
        <textarea
          rows={3}
          maxLength={300}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the opening of your adventure…"
          className="block w-full resize-none bg-transparent p-4 text-lg text-white placeholder:text-gray-500 focus:outline-none"
        />
        <div className="border-t border-edge p-3">
          <button type="submit" className="btn-primary w-full">
            Start my adventure
          </button>
        </div>
      </form>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {IDEAS.map((i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="rounded-full border border-edge px-3 py-1 text-xs text-gray-400 hover:border-accent hover:text-accent"
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}
