import "server-only";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta {
  requestId?: string;
  route?: string;
  userId?: string;
  code?: string;
  durationMs?: number;
  [key: string]: unknown;
}

const sensitiveKey = /password|token|secret|authorization|cookie|api[_-]?key|whatsapp/i;

function sanitize(meta: LogMeta): LogMeta {
  return Object.fromEntries(
    Object.entries(meta).map(([key, value]) => {
      if (sensitiveKey.test(key)) return [key, "[REDACTED]"];
      if (typeof value === "string" && value.length > 500) return [key, `${value.slice(0, 500)}…`];
      return [key, value];
    }),
  );
}

function write(level: LogLevel, msg: string, meta: LogMeta = {}) {
  const payload = {
    level,
    msg,
    time: new Date().toISOString(),
    ...sanitize(meta),
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (msg: string, meta?: LogMeta) => {
    if (process.env.NODE_ENV !== "production") write("debug", msg, meta);
  },
  info: (msg: string, meta?: LogMeta) => write("info", msg, meta),
  warn: (msg: string, meta?: LogMeta) => write("warn", msg, meta),
  error: (msg: string, meta?: LogMeta) => write("error", msg, meta),
};

export function newRequestId(): string {
  return crypto.randomUUID();
}
