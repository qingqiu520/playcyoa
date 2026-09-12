// 视频生成 provider 抽象层：秘塔(默认) / MiniMax官方 / fal，env 一行切换
// 注意：秘塔/MiniMax 都是"创建任务 -> 轮询"的异步接口；fal 走 queue API

export interface CreateResult {
  taskId: string;
}
export interface PollResult {
  status: "processing" | "succeeded" | "failed";
  videoUrl?: string;
  error?: string;
}

const PROVIDER = process.env.VIDEO_PROVIDER || "metaso";

// ---------- 秘塔 MetaSo（兼容 MiniMax 官方 v2 格式）----------
// 创建: POST {base}/v2/video_generation
// 查询: GET  {base}/v2/query/video_generation?task_id=xxx
// 以上路径以秘塔 API 面板为准，如有出入改 .env 的 *_BASE_URL 或这里的路径常量
const METASO_BASE = () => process.env.METASO_BASE_URL || "https://metaso.cn/api/minimax";
const MINIMAX_BASE = () => process.env.MINIMAX_BASE_URL || "https://api.minimax.io";

function minimaxStyleBase(provider: string) {
  return provider === "metaso" ? METASO_BASE() : MINIMAX_BASE();
}
function minimaxStyleKey(provider: string) {
  return provider === "metaso" ? process.env.METASO_API_KEY : process.env.MINIMAX_API_KEY;
}

async function createMinimaxStyle(provider: string, prompt: string): Promise<CreateResult> {
  const res = await fetch(`${minimaxStyleBase(provider)}/v2/video_generation`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${minimaxStyleKey(provider)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "MiniMax-H3",
      content: [{ type: "text", text: prompt }],
      resolution: "768P",
      duration: 5,
      ratio: "16:9",
    }),
  });
  const data = await res.json();
  const taskId = data.task_id || data?.data?.task_id;
  if (!taskId) throw new Error(`create failed: ${JSON.stringify(data).slice(0, 300)}`);
  return { taskId };
}

async function pollMinimaxStyle(provider: string, taskId: string): Promise<PollResult> {
  const res = await fetch(
    `${minimaxStyleBase(provider)}/v2/query/video_generation?task_id=${taskId}`,
    { headers: { Authorization: `Bearer ${minimaxStyleKey(provider)}` } }
  );
  const data = await res.json();
  // 秘塔实测返回: { items: [{ status: "succeeded", content: { url: "..." } }], total }
  // MiniMax 官方文档结构: { task_id, status, ... } —— 两种形状都兼容
  const item = Array.isArray(data?.items) && data.items.length ? data.items[0] : (data?.data || data);
  const status = String(item?.status || "").toLowerCase();
  if (status === "success" || status === "succeeded") {
    const videoUrl =
      item?.content?.url || item?.video_url || item?.file?.download_url;
    return { status: "succeeded", videoUrl };
  }
  if (status === "fail" || status === "failed") {
    return { status: "failed", error: item?.error || "generation failed" };
  }
  return { status: "processing" };
}

// ---------- fal queue API ----------
// 提交: POST https://queue.fal.run/{model}
// 状态: GET  https://queue.fal.run/{model}/requests/{id}/status
// 结果: GET  https://queue.fal.run/{model}/requests/{id}
const FAL_QUEUE = "https://queue.fal.run";

async function createFal(prompt: string): Promise<CreateResult> {
  const model = process.env.FAL_MODEL_ID || "fal-ai/minimax/h3-max";
  const res = await fetch(`${FAL_QUEUE}/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, duration: 5, resolution: "768P" }),
  });
  const data = await res.json();
  if (!data.request_id) throw new Error(`fal create failed: ${JSON.stringify(data).slice(0, 300)}`);
  return { taskId: data.request_id };
}

async function pollFal(taskId: string): Promise<PollResult> {
  const model = process.env.FAL_MODEL_ID || "fal-ai/minimax/h3-max";
  const headers = { Authorization: `Key ${process.env.FAL_KEY}` };
  const s = await fetch(`${FAL_QUEUE}/${model}/requests/${taskId}/status`, { headers });
  const sd = await s.json();
  if (sd.status === "COMPLETED") {
    const r = await fetch(`${FAL_QUEUE}/${model}/requests/${taskId}`, { headers });
    const rd = await r.json();
    return { status: "succeeded", videoUrl: rd?.video?.url || rd?.output?.video?.url };
  }
  if (sd.status === "FAILED") return { status: "failed", error: "fal generation failed" };
  return { status: "processing" };
}

// ---------- 统一出口 ----------
export function createVideo(prompt: string): Promise<CreateResult> {
  if (PROVIDER === "fal") return createFal(prompt);
  return createMinimaxStyle(PROVIDER, prompt);
}

export function pollVideo(taskId: string): Promise<PollResult> {
  if (PROVIDER === "fal") return pollFal(taskId);
  return pollMinimaxStyle(PROVIDER, taskId);
}
