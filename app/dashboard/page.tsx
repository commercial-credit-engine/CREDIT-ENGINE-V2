import Link from "next/link";
import { requireSession } from "@/lib/auth/require-session";
import { listDealsForUser } from "@/lib/deals";

export default async function DashboardPage() {
  const session = await requireSession();
  const deals = await listDealsForUser(session);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Dashboard
          </p>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Active deals
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Signed in as {session.email}. This list now reads from persisted
              deal records linked to your current session.
            </p>
          </div>
        </div>
        <Link
          href="/deals/new"
          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Create Deal
        </Link>
      </section>

      {deals.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            No deals yet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Create your first deal intake to start building a real workspace
            record for this session.
          </p>
          <div className="mt-6">
            <Link
              href="/deals/new"
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create Your First Deal
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    {deal.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {deal.borrowerName || "Borrower to be confirmed"}
                  </p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                  Saved deal
                </span>
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Scenario summary
                </p>
                <p className="mt-2 line-clamp-4 text-sm leading-7 text-slate-700">
                  {deal.scenario || "No scenario summary has been added yet."}
                </p>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
