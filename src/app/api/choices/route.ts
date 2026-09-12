// POST /api/choices { premise, history: string[] } -> { choices: [a, b] }
// 用 OpenAI 兼容接口基于剧情历史生成两个分支选项；没配 LLM 就走兜底选项。

const FALLBACK = [
  ["Push forward into the unknown", "Turn back and find another way"],
  ["Follow the strange sound", "Stay where it's safe"],
  ["Trust the stranger", "Go alone"],
  ["Fight", "Run"],
];

export async function POST(req: Request) {
  const { premise, history = [] } = await req.json();
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    const pick = FALLBACK[history.length % FALLBACK.length];
    return Response.json({ choices: pick });
  }
  try {
    const res = await fetch(`${process.env.OPENAI_API_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_API_MODEL || "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You write branching choices for an interactive video story. Return exactly two short options (max 12 words each), one per line, no numbering, no quotes. Options must lead to visibly different next scenes.",
          },
          {
            role: "user",
            content: `Story premise: ${premise}\nStory so far:\n${history.join("\n")}\nTwo options for what happens next:`,
          },
        ],
        temperature: 0.9,
        max_tokens: 60,
      }),
    });
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const lines = text
      .split("\n")
      .map((l: string) => l.replace(/^[-*\d.\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 2);
    if (lines.length === 2) return Response.json({ choices: lines });
  } catch {}
  const pick = FALLBACK[history.length % FALLBACK.length];
  return Response.json({ choices: pick });
}
