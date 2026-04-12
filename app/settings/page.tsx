import { requireSession } from "@/lib/auth/require-session";
import { getSessionActor } from "@/lib/identity";
import { saveBrokerProfileAction } from "@/app/settings/actions";

type SettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

const messages = {
  invalid_profile: "Enter a valid company name and email before saving.",
  profile: "Broker profile saved.",
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await requireSession();
  const actor = await getSessionActor(session);
  const { error, saved } = await searchParams;
  const errorMessage =
    error === "invalid_profile" ? messages.invalid_profile : null;
  const successMessage = saved === "profile" ? messages.profile : null;

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
            presentation workflows. The current session is {actor.email}.
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <form action={saveBrokerProfileAction} className="mt-8 grid gap-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Broker name
            </span>
            <input
              name="brokerName"
              type="text"
              defaultValue={actor.brokerName ?? ""}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Company name
            </span>
            <input
              name="companyName"
              type="text"
              defaultValue={actor.companyName}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              defaultValue={actor.email}
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
