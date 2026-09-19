import { verifyWebhook, WebhookEventType } from "@waffo/pancake-ts";
import { issueCodeForOrder, voidCodeForOrder } from "~/lib/credits";
import { redisConfigured } from "~/lib/redis";

const CREDITS_PER_ORDER = 30;

// POST /api/webhooks/waffo — Waffo 支付成功回调。
// 验签(X-Waffo-Signature) → order.completed → 幂等发放兑换码。
export async function POST(req: Request) {
  if (!redisConfigured()) {
    return Response.json({ msg: "credits storage not configured" }, { status: 503 });
  }
  const rawBody = await req.text();
  const sig = req.headers.get("x-waffo-signature");

  let event;
  try {
    event = verifyWebhook(rawBody, sig);
  } catch (e: any) {
    return Response.json({ msg: "invalid signature" }, { status: 401 });
  }

  if (event.storeId !== process.env.WAFFO_STORE_ID) {
    return Response.json({ msg: "wrong store" }, { status: 403 });
  }

  const orderId = (event.data as { orderId?: string }).orderId || event.eventId;

  if (event.eventType === WebhookEventType.OrderCompleted) {
    try {
      const code = await issueCodeForOrder(orderId, CREDITS_PER_ORDER);
      return Response.json({ ok: true, code });
    } catch (e: any) {
      return Response.json({ msg: e?.message || "issue failed" }, { status: 500 });
    }
  }

  if (event.eventType === WebhookEventType.RefundSucceeded) {
    await voidCodeForOrder(orderId).catch(() => false);
    return Response.json({ ok: true });
  }

  return Response.json({ ok: true });
}
