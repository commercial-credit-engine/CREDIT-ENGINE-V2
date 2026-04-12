import { WorkspaceTabs } from "@/components/deal/workspace-tabs";
import { requireSession } from "@/lib/auth/require-session";
import { getDealByIdForUser, listDealNotesForDeal } from "@/lib/deals";
import { createDealNoteAction } from "@/app/deals/[id]/actions";
import { notFound } from "next/navigation";

type DealWorkspacePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function DealWorkspacePage({
  params,
  searchParams,
}: DealWorkspacePageProps) {
  const session = await requireSession();
  const { id } = await params;
  const { error } = await searchParams;
  const deal = await getDealByIdForUser(session, id);

  if (!deal) {
    notFound();
  }

  const notes = await listDealNotesForDeal(session, deal.id);
  const saveNoteAction = createDealNoteAction.bind(null, deal.id);
  const errorMessage =
    error === "missing_note"
      ? "Enter a note before saving it to the deal."
      : null;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Deal workspace
            </p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {deal.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                {deal.borrowerName || "Borrower not captured yet"}. Session
                owner: {session.email}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Deal ID: {deal.id}
          </div>
        </div>
      </section>

      <WorkspaceTabs
        overview={{
          dealName: deal.name,
          borrowerName: deal.borrowerName,
          scenario: deal.scenario,
          ownerEmail: session.email,
          organizationId: deal.organizationId,
          updatedAt: deal.updatedAt,
        }}
      />

      <section
        id="notes"
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Deal notes
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Notes for this deal
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            Capture simple broker notes against the persisted deal record.
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <form action={saveNoteAction} className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Add note
            </span>
            <textarea
              name="noteBody"
              rows={5}
              placeholder="Add a note about borrower context, deal structure, or next steps."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Save Note
          </button>
        </form>

        <div className="mt-8 space-y-4">
          {notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              No notes have been saved for this deal yet.
            </div>
          ) : (
            notes.map((note) => (
              <article
                key={note.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {note.noteBody}
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Saved{" "}
                  {new Date(note.createdAt).toLocaleString("en-AU", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
