"use server";

import { requireSession } from "@/lib/auth/require-session";
import {
  createDealNoteForDeal,
  deleteDealNoteForDeal,
  updateDealOverviewForUser,
} from "@/lib/deals";
import { createDealPartyForDeal } from "@/lib/parties";
import {
  validateDealOverviewInput,
  validateNoteInput,
  validatePartyInput,
} from "@/lib/validation";
import { redirect } from "next/navigation";

export async function createDealNoteAction(
  dealId: string,
  formData: FormData,
) {
  const session = await requireSession();
  const validation = validateNoteInput(
    formData.get("noteBody")?.toString() ?? "",
  );

  if (!validation.ok) {
    redirect(`/deals/${dealId}?error=invalid_note#notes`);
  }

  const note = await createDealNoteForDeal(session, dealId, validation.data);

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
  const validation = validateDealOverviewInput({
    name: formData.get("name")?.toString() ?? "",
    borrowerName: formData.get("borrowerName")?.toString() ?? "",
    scenario: formData.get("scenario")?.toString() ?? "",
  });

  if (!validation.ok) {
    redirect(`/deals/${dealId}?error=invalid_overview`);
  }

  const deal = await updateDealOverviewForUser(session, dealId, {
    name: validation.data.name,
    borrowerName: validation.data.borrowerName,
    scenario: validation.data.scenario,
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

export async function createDealPartyAction(
  dealId: string,
  formData: FormData,
) {
  const session = await requireSession();
  const validation = validatePartyInput({
    partyName: formData.get("partyName")?.toString() ?? "",
    partyType: formData.get("partyType")?.toString() ?? "",
  });

  if (!validation.ok) {
    redirect(`/deals/${dealId}?error=invalid_party&tab=parties`);
  }

  const party = await createDealPartyForDeal(session, dealId, validation.data);

  if (!party) {
    redirect("/dashboard");
  }

  redirect(`/deals/${dealId}?saved=party&tab=parties`);
}
