"use server";

import { requireSession } from "@/lib/auth/require-session";
import {
  createDealNoteForDeal,
  deleteDealNoteForDeal,
  updateDealOverviewForUser,
} from "@/lib/deals";
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

export async function updateDealOverviewAction(
  dealId: string,
  formData: FormData,
) {
  const session = await requireSession();
  const name = formData.get("name")?.toString() ?? "";
  const borrowerName = formData.get("borrowerName")?.toString() ?? "";
  const scenario = formData.get("scenario")?.toString() ?? "";

  if (!name.trim()) {
    redirect(`/deals/${dealId}?error=missing_name`);
  }

  const deal = await updateDealOverviewForUser(session, dealId, {
    name,
    borrowerName,
    scenario,
  });

  if (!deal) {
    redirect("/dashboard");
  }

  redirect(`/deals/${dealId}?saved=overview`);
}

export async function deleteDealNoteAction(dealId: string, formData: FormData) {
  const session = await requireSession();
  const noteId = formData.get("noteId")?.toString() ?? "";

  if (!noteId) {
    redirect(`/deals/${dealId}`);
  }

  await deleteDealNoteForDeal(session, dealId, noteId);

  redirect(`/deals/${dealId}?saved=note_deleted#notes`);
}
