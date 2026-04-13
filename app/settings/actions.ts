"use server";

import { requireSession } from "@/lib/auth/require-session";
import { updateBrokerProfile } from "@/lib/identity";
import { writeSessionCookie } from "@/lib/auth/session";
import { validateProfileInput } from "@/lib/validation";
import { redirect } from "next/navigation";

export async function saveBrokerProfileAction(formData: FormData) {
  const session = await requireSession();
  const validation = validateProfileInput({
    brokerName: formData.get("brokerName")?.toString() ?? "",
    companyName: formData.get("companyName")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
  });

  if (!validation.ok) {
    redirect("/settings?error=invalid_profile");
  }

  const actor = await updateBrokerProfile(session, {
    brokerName: validation.data.brokerName,
    companyName: validation.data.companyName,
    email: validation.data.email,
  });

  await writeSessionCookie({
    userId: actor.userId,
    email: actor.email,
  });

  redirect("/settings?saved=profile");
}
