import { consumeCredit, getWallet } from "~/lib/credits";
import { redisConfigured } from "~/lib/redis";

// POST /api/credits/use { code } — 扣 1 积分，返回剩余余额。
// 生成接口在扣积分成功后才会调视频生成。
export async function POST(req: Request) {
  if (!redisConfigured()) {
    return Response.json({ msg: "credits storage not configured" }, { status: 503 });
  }
  const { code } = await req.json().catch(() => ({}));
  if (!code || typeof code !== "string") {
    return Response.json({ msg: "missing code" }, { status: 400 });
  }
  const r = await consumeCredit(code);
  if (!r.ok) {
    const w = await getWallet(code);
    return Response.json(
      { msg: w ? "no credits left" : "invalid code", balance: r.balance },
      { status: 402 }
    );
  }
  return Response.json({ ok: true, balance: r.balance });
}
