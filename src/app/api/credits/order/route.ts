import { codeForOrder, getWallet } from "~/lib/credits";
import { redisConfigured } from "~/lib/redis";

// GET /api/credits/order?id=xxx — 支付成功页用订单号换兑换码（幂等，可刷新）。
export async function GET(req: Request) {
  if (!redisConfigured()) {
    return Response.json({ msg: "credits storage not configured" }, { status: 503 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ msg: "missing id" }, { status: 400 });

  const code = await codeForOrder(id);
  if (!code) {
    // Webhook 可能有几秒延迟 — 前端可重试
    return Response.json({ pending: true }, { status: 404 });
  }
  const w = await getWallet(code);
  return Response.json({ code, credits: w?.credits ?? 30 });
}
