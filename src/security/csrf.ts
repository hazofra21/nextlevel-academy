import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const CSRF_TOKEN_TTL_SECONDS = 60 * 15;

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required CSRF env: ${name}`);
  }

  return value;
}

function signValue(value: string) {
  return createHmac("sha256", getRequiredEnv("ADMIN_SESSION_SECRET"))
    .update(value)
    .digest("hex");
}

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) return false;

  return timingSafeEqual(aBuffer, bBuffer);
}

export function createCsrfToken(scope: string) {
  const expiresAt = Date.now() + CSRF_TOKEN_TTL_SECONDS * 1000;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${scope}:${expiresAt}:${nonce}`;
  const signature = signValue(payload);

  return `${payload}:${signature}`;
}

export function verifyCsrfToken(token: string | null | undefined, scope: string) {
  if (!token) return false;

  const [tokenScope, expiresAt, nonce, signature] = token.split(":");

  if (!tokenScope || !expiresAt || !nonce || !signature) return false;
  if (tokenScope !== scope) return false;
  if (Number.isNaN(Number(expiresAt))) return false;
  if (Date.now() > Number(expiresAt)) return false;

  const expectedSignature = signValue(`${tokenScope}:${expiresAt}:${nonce}`);

  return safeCompare(signature, expectedSignature);
}
