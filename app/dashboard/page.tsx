import Link from "next/link";

const deals = [
  {
    id: "deal-101",
    name: "Acacia Business Park Refinance",
    borrower: "Acacia Holdings Pty Ltd",
    stage: "Scenario review",
    facility: "$4.8M commercial term loan",
  },
  {
    id: "deal-102",
    name: "Riverside Equipment Expansion",
    borrower: "Northbank Civil Group",
    stage: "Security mapping",
    facility: "$1.6M equipment line",
  },
  {
    id: "deal-103",
    name: "Harbour Retail Acquisition",
    borrower: "Mercer Retail Trust",
    stage: "Lender strategy",
    facility: "$7.2M acquisition facility",
  },
  {
    id: "deal-104",
    name: "Summit Warehousing Capex",
    borrower: "Summit Logistics Operations",
    stage: "Documents outstanding",
    facility: "$2.4M working capital package",
  },
];

export default function DashboardPage() {
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
              A simple working shell for the deal pipeline. Mock records are in
              place until real data modeling lands in later batches.
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
                <p className="mt-2 text-sm text-slate-500">{deal.borrower}</p>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
                {deal.stage}
              </span>
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Requested structure
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {deal.facility}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
