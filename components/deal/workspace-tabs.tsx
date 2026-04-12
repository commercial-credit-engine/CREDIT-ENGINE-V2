"use client";

import { useState } from "react";

type DealOverview = {
  dealName: string;
  borrowerName: string | null;
  scenario: string | null;
  ownerEmail: string;
  organizationId: string;
  updatedAt: string;
};

type WorkspaceSection = {
  id: string;
  label: string;
  heading: string;
  description: string;
  bullets: string[];
};

const sections: WorkspaceSection[] = [
  {
    id: "overview",
    label: "Overview",
    heading: "Deal snapshot",
    description:
      "Summarize the transaction, funding purpose, and current structure before drilling into details.",
    bullets: [
      "Facility request, priority, and timing",
      "Commercial objective and use of funds",
      "Key credit observations for initial review",
    ],
  },
  {
    id: "parties",
    label: "Parties",
    heading: "Borrowers and guarantors",
    description:
      "Track the entities and people involved so the lending structure stays clear.",
    bullets: [
      "Borrower and operating entity roles",
      "Guarantor coverage and support",
      "Ownership relationships and contacts",
    ],
  },
  {
    id: "securities",
    label: "Securities",
    heading: "Security position",
    description:
      "Outline the asset pool and proposed security package supporting the deal.",
    bullets: [
      "Property, asset, or cash security",
      "Priority ranking and coverage notes",
      "Valuation and enforcement considerations",
    ],
  },
  {
    id: "existing-debts",
    label: "Existing Debts",
    heading: "Current obligations",
    description:
      "Map the current debt stack and identify what the new structure needs to refinance or sit behind.",
    bullets: [
      "Current lenders and balances",
      "Repayment pressure points and maturities",
      "Refinance requirements and payout needs",
    ],
  },
  {
    id: "proposed-facilities",
    label: "Proposed Facilities",
    heading: "Target facility structure",
    description:
      "Define the requested facilities and how each one supports the borrower scenario.",
    bullets: [
      "Loan type, limit, and term",
      "Interest and repayment approach",
      "Covenant or condition themes",
    ],
  },
  {
    id: "mapping",
    label: "Mapping",
    heading: "Credit mapping",
    description:
      "Connect the scenario to the lender lens by mapping strengths, gaps, and mitigants.",
    bullets: [
      "Scenario-to-credit issue mapping",
      "Key exceptions and risk treatment",
      "Evidence needed to support the case",
    ],
  },
  {
    id: "documents",
    label: "Documents",
    heading: "Submission support pack",
    description:
      "Keep the document checklist visible so the deal can move from intake to submission smoothly.",
    bullets: [
      "Financials, statements, and identification",
      "Security evidence and valuations",
      "Supporting notes and transaction documents",
    ],
  },
  {
    id: "lender-strategy",
    label: "Lender Strategy",
    heading: "Target lender approach",
    description:
      "Frame how the deal should be positioned, who should see it, and why it fits.",
    bullets: [
      "Lender appetite and policy fit",
      "Submission angle and message priority",
      "Fallback paths and negotiation posture",
    ],
  },
  {
    id: "submission",
    label: "Submission",
    heading: "Final package",
    description:
      "Review the assembled story before the deal is taken to market or sent for credit review.",
    bullets: [
      "Executive summary and structure notes",
      "Outstanding conditions to close",
      "Ready-for-send checklist",
    ],
  },
];

type WorkspaceTabsProps = {
  overview: DealOverview;
};

export function WorkspaceTabs({ overview }: WorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState(sections[0].id);
  const activeSection =
    sections.find((section) => section.id === activeTab) ?? sections[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Workspace Sections
        </p>
        <div className="flex flex-col gap-2">
          {sections.map((section) => {
            const isActive = section.id === activeTab;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveTab(section.id)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {activeSection.label}
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {activeSection.heading}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              {activeSection.description}
            </p>
          </div>
          {activeSection.id === "overview" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Deal name
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {overview.dealName}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Borrower
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {overview.borrowerName || "Not provided yet"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Owner session
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {overview.ownerEmail}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Organization linkage
                </p>
                <p className="mt-2 break-all text-sm font-medium text-slate-900">
                  {overview.organizationId}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Scenario summary
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {overview.scenario || "No scenario summary has been saved yet."}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Last updated
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {new Date(overview.updatedAt).toLocaleString("en-AU", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                {activeSection.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                  >
                    {bullet}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-700">
                  Placeholder panel
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  This panel is ready for later batch expansion. The overview
                  tab already reflects live persisted deal data.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
