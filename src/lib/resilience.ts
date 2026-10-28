import "server-only";

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  label = "operation",
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`${label} timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
  label?: string;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  { retries = 2, baseDelayMs = 300, timeoutMs = 7000, label = "read" }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await withTimeout(operation(), timeoutMs, label);
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      const delay = baseDelayMs * Math.pow(3, attempt) + Math.random() * 150;
      await sleep(delay);
    }
  }
  throw lastError;
}

type BreakerState = "closed" | "open" | "half-open";

interface BreakerEntry {
  failures: number;
  openedAt: number | null;
  state: BreakerState;
}

const breakers = new Map<string, BreakerEntry>();
const FAILURE_THRESHOLD = 5;
const OPEN_MS = 30_000;

export async function withBreaker<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const entry = breakers.get(key) ?? { failures: 0, openedAt: null, state: "closed" };

  if (entry.state === "open" && entry.openedAt && now - entry.openedAt < OPEN_MS) {
    throw new Error(`Circuit breaker open for ${key}`);
  }
  if (entry.state === "open") {
    entry.state = "half-open";
  }

  try {
    const result = await operation();
    breakers.set(key, { failures: 0, openedAt: null, state: "closed" });
    return result;
  } catch (error) {
    const failures = entry.failures + 1;
    const state: BreakerState = failures >= FAILURE_THRESHOLD ? "open" : "closed";
    breakers.set(key, {
      failures,
      openedAt: state === "open" ? now : entry.openedAt,
      state,
    });
    throw error;
  }
}

export function resetBreaker(key: string) {
  breakers.delete(key);
}
