"use server";

import { requireSession } from "@/lib/auth/require-session";
import { createDealNoteForDeal } from "@/lib/deals";
import { redirect } from "next/navigation";

export async function createDealNoteAction(
  dealId: string,
  formData: FormData,
) {
  const session = await requireSession();
  const noteBody = formData.get("noteBody")?.toString() ?? "";

  if (!noteBody.trim()) {
    redirect(`/deals/${dealId}?error=missing_note`);
  }

  const note = await createDealNoteForDeal(session, dealId, noteBody);

  if (!note) {
    redirect("/dashboard");
  }

  redirect(`/deals/${dealId}#notes`);
}
