import { getWallet } from "~/lib/credits";
import { redisConfigured } from "~/lib/redis";

// GET /api/credits/balance?code=CYOA-XXXX-XXXX
export async function GET(req: Request) {
  if (!redisConfigured()) {
    return Response.json({ msg: "credits storage not configured" }, { status: 503 });
  }
  const code = new URL(req.url).searchParams.get("code");
  if (!code) return Response.json({ msg: "missing code" }, { status: 400 });

  const w = await getWallet(code);
  if (!w) return Response.json({ msg: "invalid code" }, { status: 404 });
  return Response.json({ balance: w.balance, credits: w.credits });
}
