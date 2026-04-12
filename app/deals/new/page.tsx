export default function NewDealPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            New deal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Deal intake
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Start a new commercial lending scenario with the essential context.
            Submission logic and persistence will be added in later batches.
          </p>
        </div>

        <form className="mt-8 grid gap-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Deal name</span>
            <input
              type="text"
              placeholder="Acacia Business Park Refinance"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Borrower</span>
            <input
              type="text"
              placeholder="Acacia Holdings Pty Ltd"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Scenario</span>
            <textarea
              rows={7}
              placeholder="Describe the borrower, the transaction, the requested facilities, and the current debt or security position."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Submit Deal Intake
          </button>
        </form>
      </section>
    </div>
  );
}
