// Upstash Redis REST client — 零依赖，用 fetch 直接打 REST API。
// 需要环境变量: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

const URL = () => process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = () => process.env.UPSTASH_REDIS_REST_TOKEN || "";

export function redisConfigured() {
  return Boolean(URL() && TOKEN());
}

async function call<T>(...cmd: (string | number)[]): Promise<T> {
  const res = await fetch(URL(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) {
    throw new Error(data.error || `redis ${res.status}`);
  }
  return data.result as T;
}

export const redis = {
  get: (key: string) => call<string | null>("GET", key),
  set: (key: string, value: string) => call<string>("SET", key, value),
  setnx: (key: string, value: string) =>
    call<number>("SET", key, value, "NX"),
  incrby: (key: string, n: number) => call<number>("INCRBY", key, n),
};
