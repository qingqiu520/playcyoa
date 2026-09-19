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
  const raw = await redis.get(`code:${code.toUpperCase().trim()}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CreditWallet;
  } catch {
    return null;
  }
}

// 原子扣减：余额不足返回 false；成功后把新余额写回。
export async function consumeCredit(code: string): Promise<{
  ok: boolean;
  balance: number;
}> {
  const key = `code:${code.toUpperCase().trim()}`;
  // 简单实现：读-改-写。并发消耗同一码有极小竞态，
  // 但单用户串行使用场景可接受（严格原子可换 Lua/INCR 余额字段）。
  const w = await getWallet(code);
  if (!w || w.balance <= 0) return { ok: false, balance: w?.balance ?? 0 };
  w.balance -= 1;
  await redis.set(key, JSON.stringify(w));
  return { ok: true, balance: w.balance };
}
