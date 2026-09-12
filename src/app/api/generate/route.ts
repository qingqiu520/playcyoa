import { createVideo, pollVideo } from "~/lib/provider";
import { tryConsumeGeneration } from "~/lib/quota";

// POST /api/generate  { prompt } -> { taskId } | { status: 603, msg } 配额用尽
export async function POST(req: Request) {
  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== "string" || prompt.length > 1500) {
    return Response.json({ msg: "invalid prompt", status: 400 });
  }
  const q = tryConsumeGeneration();
  if (!q.ok) {
    return Response.json({
      msg: "Today's creation quota is full — new scenes open tomorrow.",
      status: 603,
    });
  }
  try {
    const { taskId } = await createVideo(prompt);
    return Response.json({ taskId });
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
