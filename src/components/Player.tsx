"use client";
import { useRef, useState } from "react";
import type { Story } from "~/lib/stories";

interface CustomNode {
  video: string;
  caption: string;
  choices: { label: string; next: string }[];
}

const STYLE =
  "Cinematic photorealistic shot, film lighting, continuous scene, 16:9.";

export default function Player({
  story,
  customPremise,
}: {
  story?: Story;
  customPremise?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nodeId, setNodeId] = useState(story?.start || "");
  const [customHistory, setCustomHistory] = useState<string[]>(
    customPremise ? [customPremise] : []
  );
  const [customNode, setCustomNode] = useState<CustomNode | null>(null);
  const [choices, setChoices] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState("");

  const node: CustomNode | null = story
    ? story.nodes[nodeId] || null
    : customNode;

  // ---------- 自定义模式：生成一段视频 ----------
  const generateScene = async (prompt: string) => {
    setLoading(true);
    setEnded(false);
    setChoices(null);
    setError("");
    try {
      const creditCode =
        typeof window !== "undefined"
          ? localStorage.getItem("cyoa_credit_code")
          : null;
      const r = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: `${STYLE} ${prompt}`,
          ...(creditCode ? { credit_code: creditCode } : {}),
        }),
      });
      const data = await r.json();
      if (data.status === 603) {
        setError(data.msg);
        setLoading(false);
        return;
      }
      if (!data.taskId) throw new Error(data.msg || "create failed");
      // 轮询直到出片
      for (let i = 0; i < 60; i++) {
        await new Promise((s) => setTimeout(s, 4000));
        const pr = await fetch(`/api/generate?task_id=${data.taskId}`);
        const pd = await pr.json();
        if (pd.status === "succeeded" && pd.videoUrl) {
          setCustomNode({ video: pd.videoUrl, caption: prompt, choices: [] });
          setLoading(false);
          return;
        }
        if (pd.status === "failed") throw new Error(pd.error || "failed");
      }
      throw new Error("timeout");
    } catch (e: any) {
      setError(e?.message || "generation failed");
      setLoading(false);
    }
  };

  const fetchChoices = async (premise: string, history: string[]) => {
    const r = await fetch("/api/choices", {
      method: "POST",
      body: JSON.stringify({ premise, history }),
    });
    const d = await r.json();
    setChoices(d.choices);
  };

  const onEnded = () => {
    setEnded(true);
    if (!story) {
      fetchChoices(customPremise || "", customHistory);
    }
  };

  const pickTreeChoice = (next: string) => {
    setNodeId(next);
    setEnded(false);
    setTimeout(() => videoRef.current?.play(), 50);
  };

  const pickCustomChoice = (label: string) => {
    const history = [...customHistory, `Chose: ${label}`];
    setCustomHistory(history);
    generateScene(`${customPremise}. The story continues: ${label}`);
  };

  const startCustom = () => generateScene(customPremise!);

  // ---------- 渲染 ----------
  if (!story && !customNode && !loading && !error) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-gray-400">Your opening:</p>
        <p className="mb-6 text-xl text-white">“{customPremise}”</p>
        <button onClick={startCustom} className="btn-primary text-lg">
          Generate the opening scene
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl border border-edge bg-black">
        {node ? (
          <video
            key={node.video}
            ref={videoRef}
            src={node.video}
            className="aspect-video w-full"
            controls
            autoPlay
            playsInline
            onEnded={onEnded}
          />
        ) : null}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="mt-3 text-sm text-gray-300">
              Generating your scene… (~10–30s)
            </p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/85 p-6 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        {ended && node && (
          <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/95 to-transparent p-4 md:p-6">
            {story &&
              node.choices.map((c) => (
                <button
                  key={c.next}
                  onClick={() => pickTreeChoice(c.next)}
                  className="btn-choice"
                >
                  ▸ {c.label}
                </button>
              ))}
            {story && node.choices.length === 0 && (
              <div className="text-center">
                <p className="mb-2 text-lg font-semibold text-white">The End</p>
                <button
                  onClick={() => pickTreeChoice(story.start)}
                  className="btn-primary"
                >
                  Play again
                </button>
              </div>
            )}
            {!story &&
              (choices ? (
                choices.map((c) => (
                  <button
                    key={c}
                    onClick={() => pickCustomChoice(c)}
                    className="btn-choice"
                  >
                    ▸ {c}
                  </button>
                ))
              ) : (
                <p className="text-center text-sm text-gray-300">
                  Writing your next choices…
                </p>
              ))}
          </div>
        )}
      </div>
      {node?.caption && (
        <p className="mt-3 text-center text-sm text-gray-400">{node.caption}</p>
      )}
    </div>
  );
}
