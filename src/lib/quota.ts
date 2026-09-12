// 全局每日生成配额。
// 实现：模块级 Map（date -> count）。
// 注意：Vercel serverless 下每个实例一份计数，是"近似熔断"不是精确计数；
// 精确兜底靠秘塔预付费余额（烧完自动停）。要严格限额可换 Vercel KV。

const counts = new Map<string, number>();

const LIMIT = () => parseInt(process.env.DAILY_GENERATION_LIMIT || "30", 10);

export function tryConsumeGeneration(): { ok: boolean; used: number; limit: number } {
  const limit = LIMIT();
  const day = new Date().toISOString().slice(0, 10);
  const used = counts.get(day) || 0;
  if (limit > 0 && used >= limit) {
    return { ok: false, used, limit };
  }
  counts.set(day, used + 1);
  return { ok: true, used: used + 1, limit };
}

export function quotaState() {
  const day = new Date().toISOString().slice(0, 10);
  return { used: counts.get(day) || 0, limit: LIMIT() };
}
