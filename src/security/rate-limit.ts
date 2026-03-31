type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  windowMs: number;
  max: number;
};

const globalStore = globalThis as typeof globalThis & {
  __nlaRateLimitStore?: Map<string, RateLimitEntry>;
};

function getStore() {
  if (!globalStore.__nlaRateLimitStore) {
    globalStore.__nlaRateLimitStore = new Map<string, RateLimitEntry>();
  }

  return globalStore.__nlaRateLimitStore;
}

function getUpstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) return null;

  return { url, token };
}

export function isDistributedRateLimitEnabled() {
  return Boolean(getUpstashConfig());
}

function consumeInMemoryRateLimit({
  key,
  windowMs,
  max,
}: RateLimitOptions) {
  const store = getStore();
  const now = Date.now();
  const current = store.get(key);

  if (!current || now > current.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      ok: true,
      remaining: max - 1,
      resetAt: now + windowMs,
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    ok: current.count <= max,
    remaining: Math.max(0, max - current.count),
    resetAt: current.resetAt,
  };
}

async function consumeUpstashRateLimit({
  key,
  windowMs,
  max,
}: RateLimitOptions) {
  const config = getUpstashConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify([
      ["INCR", key],
      ["PEXPIRE", key, windowMs, "NX"],
      ["PTTL", key],
    ]),
  });

  if (!response.ok) {
    throw new Error("Upstash rate limit request failed");
  }

  const payload = (await response.json()) as Array<{ result?: string | number | null }>;
  const count = Number(payload[0]?.result ?? 0);
  const ttl = Number(payload[2]?.result ?? windowMs);
  const normalizedTtl = Number.isFinite(ttl) && ttl > 0 ? ttl : windowMs;

  return {
    ok: count <= max,
    remaining: Math.max(0, max - count),
    resetAt: Date.now() + normalizedTtl,
  };
}

export async function consumeRateLimit(options: RateLimitOptions) {
  try {
    const upstashResult = await consumeUpstashRateLimit(options);

    if (upstashResult) {
      return upstashResult;
    }
  } catch {
    // Fall back to in-memory limiting if distributed storage is unavailable.
  }

  return consumeInMemoryRateLimit(options);
}
