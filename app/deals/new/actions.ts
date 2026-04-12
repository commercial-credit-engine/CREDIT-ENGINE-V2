"use server";

import { requireSession } from "@/lib/auth/require-session";
import { createDealForUser } from "@/lib/deals";
import { redirect } from "next/navigation";

export async function createDealAction(formData: FormData) {
  const session = await requireSession();
  const name = formData.get("name")?.toString() ?? "";
  const borrowerName = formData.get("borrowerName")?.toString() ?? "";
  const scenario = formData.get("scenario")?.toString() ?? "";

  if (!name.trim()) {
    redirect("/deals/new?error=missing_name");
  }

  const deal = await createDealForUser(session, {
    name,
    borrowerName,
    scenario,
  });

  redirect(`/deals/${deal.id}`);
}
