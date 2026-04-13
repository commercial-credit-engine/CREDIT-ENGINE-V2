export function validateProfileInput(input: {
  brokerName: string;
  companyName: string;
  email: string;
}) {
  const brokerName = input.brokerName.trim();
  const companyName = input.companyName.trim();
  const email = input.email.trim().toLowerCase();
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!companyName || companyName.length > 160 || !hasValidEmail) {
    return { ok: false as const, error: "invalid_profile" };
  }

  if (brokerName.length > 120) {
    return { ok: false as const, error: "invalid_profile" };
  }

  return {
    ok: true as const,
    data: {
      brokerName,
      companyName,
      email,
    },
  };
}

export function validateDealOverviewInput(input: {
  name: string;
  borrowerName: string;
  scenario: string;
}) {
  const name = input.name.trim();
  const borrowerName = input.borrowerName.trim();
  const scenario = input.scenario.trim();

  if (!name || name.length > 160) {
    return { ok: false as const, error: "invalid_overview" };
  }

  if (borrowerName.length > 160 || scenario.length > 4000) {
    return { ok: false as const, error: "invalid_overview" };
  }

  return {
    ok: true as const,
    data: {
      name,
      borrowerName,
      scenario,
    },
  };
}

export function validateNoteInput(noteBody: string) {
  const normalized = noteBody.trim();

  if (!normalized || normalized.length > 2000) {
    return { ok: false as const, error: "invalid_note" };
  }

  return {
    ok: true as const,
    data: normalized,
  };
}

export function validatePartyInput(input: {
  partyName: string;
  partyType: string;
}) {
  const partyName = input.partyName.trim();
  const partyType = input.partyType.trim().toLowerCase();

  if (!partyName || partyName.length > 160) {
    return { ok: false as const, error: "invalid_party" };
  }

  if (partyType !== "borrower" && partyType !== "guarantor") {
    return { ok: false as const, error: "invalid_party" };
  }

  return {
    ok: true as const,
    data: {
      partyName,
      partyType: partyType as "borrower" | "guarantor",
    },
  };
}
