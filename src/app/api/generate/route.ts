import { createVideo, pollVideo } from "~/lib/provider";
import { tryConsumeGeneration } from "~/lib/quota";
import { scanPromptSafety } from "~/lib/safety";
import { consumeCredit } from "~/lib/credits";
import { redisConfigured } from "~/lib/redis";

// POST /api/generate  { prompt, credit_code? } -> { taskId } | { status: 603, msg } 配额用尽
export async function POST(req: Request) {
  const { prompt, credit_code } = await req.json();
  if (!prompt || typeof prompt !== "string" || prompt.length > 1500) {
    return Response.json({ msg: "invalid prompt", status: 400 });
  }
  const safety = await scanPromptSafety(prompt);
  if (safety === "block") {
    return Response.json({
      msg: "This prompt doesn't meet our content guidelines — try a different premise.",
      status: 451,
    });
  }
  if (safety === "review") {
    return Response.json({
      msg: "This prompt needs a moment to be checked — please try again shortly.",
      status: 429,
    });
  }
  // 有兑换码则优先扣积分（跳过每日配额）；无码走免费配额。
  let paidBalance: number | null = null;
  if (credit_code && typeof credit_code === "string" && redisConfigured()) {
    const c = await consumeCredit(credit_code);
    if (c.ok) {
      paidBalance = c.balance;
    }
  }
  if (paidBalance === null) {
    const q = tryConsumeGeneration();
    if (!q.ok) {
      return Response.json({
        msg: "Today's creation quota is full — new scenes open tomorrow.",
        status: 603,
      });
    }
  }
  try {
    const { taskId } = await createVideo(prompt);
    return Response.json({ taskId, creditsLeft: paidBalance ?? undefined });
  } catch (e: any) {
    return Response.json({ msg: e?.message || "create failed", status: 500 });
  }
}

// GET /api/generate?task_id=xxx -> { status, videoUrl? }
export async function GET(req: Request) {
  const taskId = new URL(req.url).searchParams.get("task_id");
  if (!taskId) return Response.json({ msg: "missing task_id", status: 400 });
  try {
    const r = await pollVideo(taskId);
    return Response.json(r);
  } catch (e: any) {
    return Response.json({ status: "processing", msg: e?.message });
  }
}
