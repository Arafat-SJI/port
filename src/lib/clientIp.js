/** Best-effort client IP from request headers (proxies / local). */

export function getClientIpFromHeaders(headers) {
  const h =
    headers && typeof headers.get === "function"
      ? headers
      : { get: () => null };

  const forwarded = String(h.get("x-forwarded-for") ?? "")
    .split(",")[0]
    ?.trim();
  if (forwarded) return forwarded.slice(0, 64);

  const realIp = String(h.get("x-real-ip") ?? "").trim();
  if (realIp) return realIp.slice(0, 64);

  const cf = String(h.get("cf-connecting-ip") ?? "").trim();
  if (cf) return cf.slice(0, 64);

  return "unknown";
}
