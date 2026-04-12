export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Settings
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Broker profile
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            Store the broker details that will later feed submission and deal
            presentation workflows.
          </p>
        </div>

        <form className="mt-8 grid gap-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Broker name
            </span>
            <input
              type="text"
              defaultValue="Alex Mercer"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Company name
            </span>
            <input
              type="text"
              defaultValue="Mercer Commercial Finance"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              defaultValue="alex@mercerfinance.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-500"
            />
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Save
          </button>
        </form>
      </section>
    </div>
  );
}
