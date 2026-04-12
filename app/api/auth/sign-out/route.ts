import { clearSessionCookie } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/sign-in", request.url), {
    status: 303,
  });

  clearSessionCookie(response);

  return response;
}
