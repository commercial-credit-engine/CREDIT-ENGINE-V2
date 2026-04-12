"use server";

import { requireSession } from "@/lib/auth/require-session";
import { updateBrokerProfile } from "@/lib/identity";
import { writeSessionCookie } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function saveBrokerProfileAction(formData: FormData) {
  const session = await requireSession();
  const brokerName = formData.get("brokerName")?.toString() ?? "";
  const companyName = formData.get("companyName")?.toString() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!companyName.trim() || !hasValidEmail) {
    redirect("/settings?error=invalid_profile");
  }

  const actor = await updateBrokerProfile(session, {
    brokerName,
    companyName,
    email,
  });

  await writeSessionCookie({
    userId: actor.userId,
    email: actor.email,
  });

  redirect("/settings?saved=profile");
}
