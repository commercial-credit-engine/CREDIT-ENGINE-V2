export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 items-center">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Sign in
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Access your deal workspace
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            Authentication is not connected yet. This page is a UI shell for
            the next batch.
          </p>
        </div>

        <form className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              placeholder="broker@creditengine.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign In
          </button>
        </form>
      </section>
    </div>
  );
}
