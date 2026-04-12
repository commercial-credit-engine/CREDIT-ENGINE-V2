import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}
