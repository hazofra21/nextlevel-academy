function getForwardedHost(headers: Headers) {
  const forwardedHost = headers.get("x-forwarded-host")?.trim();

  if (forwardedHost) {
    return forwardedHost.split(",")[0]?.trim() ?? null;
  }

  return headers.get("host")?.trim() ?? null;
}

function getForwardedProto(headers: Headers) {
  const forwardedProto = headers.get("x-forwarded-proto")?.trim();

  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() ?? null;
  }

  return null;
}

function getExpectedOrigin(headers: Headers) {
  const host = getForwardedHost(headers);

  if (!host) return null;

  const proto =
    getForwardedProto(headers) ??
    (host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${proto}://${host}`;
}

function extractOrigin(value: string | null) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isTrustedOrigin(headers: Headers) {
  const expectedOrigin = getExpectedOrigin(headers);

  if (!expectedOrigin) return false;

  const origin = extractOrigin(headers.get("origin"));
  if (origin) {
    return origin === expectedOrigin;
  }

  const refererOrigin = extractOrigin(headers.get("referer"));
  if (refererOrigin) {
    return refererOrigin === expectedOrigin;
  }

  return false;
}
