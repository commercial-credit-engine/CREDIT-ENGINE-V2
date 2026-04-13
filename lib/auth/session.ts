import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import type { NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "credit_engine_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
  userId: string;
  email: string;
};

type SessionPayload = SessionUser & {
  expiresAt: number;
};

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "credit-engine-v2-local-session-secret";
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function decodePayload(encodedPayload: string) {
  const decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");
  return JSON.parse(decoded) as SessionPayload;
}

function isLocalHostname(hostname: string | null) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

function shouldUseSecureCookie(hostname: string | null, forwardedProto?: string | null) {
  if (isLocalHostname(hostname)) {
    return false;
  }

  if (forwardedProto) {
    return forwardedProto === "https";
  }

  return process.env.NODE_ENV === "production";
}

function getCookieConfigForHost(
  hostname: string | null,
  forwardedProto?: string | null,
) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseSecureCookie(hostname, forwardedProto),
    path: "/",
  };
}

function getResponseCookieConfig(request?: Request) {
  const requestUrl = request ? new URL(request.url) : null;
  const hostname = requestUrl?.hostname ?? null;
  const forwardedProto = request?.headers.get("x-forwarded-proto");

  return getCookieConfigForHost(hostname, forwardedProto);
}

export function deriveUserIdFromEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const hash = createHash("sha256").update(normalizedEmail).digest("hex");

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    hash.slice(12, 16),
    hash.slice(16, 20),
    hash.slice(20, 32),
  ].join("-");
}

export function createSessionToken(user: SessionUser) {
  const payload: SessionPayload = {
    ...user,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  const encodedPayload = encodePayload(payload);
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function readSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const providedSignature = Buffer.from(signature);
  const computedSignature = Buffer.from(expectedSignature);

  if (
    providedSignature.length !== computedSignature.length ||
    !timingSafeEqual(providedSignature, computedSignature)
  ) {
    return null;
  }

  try {
    const payload = decodePayload(encodedPayload);

    if (payload.expiresAt < Date.now()) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
    } satisfies SessionUser;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return readSessionToken(token);
}

export async function writeSessionCookie(user: SessionUser) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const hostHeader = headerStore.get("host");
  const hostname = hostHeader ? hostHeader.split(":")[0] : null;
  const forwardedProto = headerStore.get("x-forwarded-proto");

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken(user),
    ...getCookieConfigForHost(hostname, forwardedProto),
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function setSessionCookie(
  response: NextResponse,
  user: SessionUser,
  request?: Request,
) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken(user),
    ...getResponseCookieConfig(request),
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse, request?: Request) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    ...getResponseCookieConfig(request),
    maxAge: 0,
  });
}
