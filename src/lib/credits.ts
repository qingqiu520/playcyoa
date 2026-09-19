// 积分兑换码钱包：订单 -> 唯一兑换码 -> 余额。
// Redis keys:
//   order:{orderId} -> code          （幂等：同订单永远返回同码）
//   code:{code}     -> {orderId, balance, credits, createdAt}
import { redis } from "~/lib/redis";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 无易混淆字符

export function newCode(): string {
  const seg = (n: number) =>
    Array.from(
      { length: n },
      () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    ).join("");
  return `CYOA-${seg(4)}-${seg(4)}`;
}

export interface CreditWallet {
  orderId: string;
  credits: number; // 购买时的总积分
  balance: number; // 剩余
  createdAt: string;
}

// 订单完成后发放兑换码（幂等）。
export async function issueCodeForOrder(
  orderId: string,
  credits: number
): Promise<string> {
  const existing = await redis.get(`order:${orderId}`);
  if (existing) return existing;
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    const wallet: CreditWallet = {
      orderId,
      credits,
      balance: credits,
      createdAt: new Date().toISOString(),
    };
    const ok = await redis.setnx(`code:${code}`, JSON.stringify(wallet));
    if (ok === 1) {
      // 权威余额用独立计数器，扣减走 INCRBY 保证原子性
      await redis.set(`bal:${code}`, String(credits));
      await redis.set(`order:${orderId}`, code);
      return code;
    }
  }
  throw new Error("code collision");
}

export async function codeForOrder(orderId: string): Promise<string | null> {
  return redis.get(`order:${orderId}`);
}

export async function getWallet(code: string): Promise<CreditWallet | null> {
  const c = code.toUpperCase().trim();
  const raw = await redis.get(`code:${c}`);
  if (!raw) return null;
  try {
    const w = JSON.parse(raw) as CreditWallet;
    const bal = await redis.get(`bal:${c}`);
    if (bal !== null) w.balance = Number(bal); // 以计数器为准
    return w;
  } catch {
    return null;
  }
}

// 退款作废：把该订单的兑换码余额清零。
export async function voidCodeForOrder(orderId: string): Promise<boolean> {
  const code = await redis.get(`order:${orderId}`);
  if (!code) return false;
  const w = await getWallet(code);
  if (!w) return false;
  w.balance = 0;
  await redis.set(`code:${code}`, JSON.stringify(w));
  await redis.set(`bal:${code}`, "0");
  return true;
}

// 原子扣减：对 bal:{code} 做 INCRBY -1；扣到负数说明本来就没余额，加回去并失败。
export async function consumeCredit(code: string): Promise<{
  ok: boolean;
  balance: number;
}> {
  const key = `bal:${code.toUpperCase().trim()}`;
  const after = await redis.incrby(key, -1);
  if (after < 0) {
    await redis.incrby(key, 1); // 回滚
    return { ok: false, balance: 0 };
  }
  // 同步钱包 JSON 里的展示余额（尽力而为，权威是 bal: 计数器）
  const w = await getWallet(code);
  if (w) {
    w.balance = after;
    await redis.set(`code:${code.toUpperCase().trim()}`, JSON.stringify(w));
  }
  return { ok: true, balance: after };
}
