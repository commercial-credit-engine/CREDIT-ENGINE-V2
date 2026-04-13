import { ensureIdentityForEmail } from "@/lib/identity";
import { deriveUserIdFromEmail, setSessionCookie } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!hasValidEmail || !password) {
    return NextResponse.redirect(
      new URL("/sign-in?error=invalid_credentials", request.url),
      { status: 303 },
    );
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url), {
    status: 303,
  });

  try {
    const actor = await ensureIdentityForEmail(email);

    setSessionCookie(
      response,
      {
        userId: actor.userId,
        email: actor.email,
      },
      request,
    );
  } catch {
    setSessionCookie(
      response,
      {
        userId: deriveUserIdFromEmail(email),
        email,
      },
      request,
    );
  }

  return response;
}
