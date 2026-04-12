import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  invalid_credentials: "Enter a valid email and password to continue.",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] ?? "Unable to sign in." : null;

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
            Use the local session foundation to enter the protected workspace.
            This flow is ready for later database-backed user validation.
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <form action="/api/auth/sign-in" method="post" className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              placeholder="broker@creditengine.com"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
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
