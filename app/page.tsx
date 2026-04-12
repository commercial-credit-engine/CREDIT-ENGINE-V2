import Link from "next/link";

const quickLinks = [
  { href: "/dashboard", label: "Open Dashboard" },
  { href: "/deals/new", label: "Start a New Deal" },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Deal-first commercial lending workspace
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Credit Engine V2 helps brokers shape lending opportunities into
              submission-ready deals.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Structure the scenario, organize key parties and securities, and
              prepare a clear lender strategy from one focused workspace.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Intake
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Capture borrower context, facility needs, and the scenario summary
            that defines the deal.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Move through parties, securities, debt position, mapping, and
            lender strategy in one visible flow.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Submission
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Build a structured story that is easier to review, compare, and
            send onward when the deal is ready.
          </p>
        </article>
      </section>
    </div>
  );
}
