import { WorkspaceTabs } from "@/components/deal/workspace-tabs";

type DealWorkspacePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DealWorkspacePage({
  params,
}: DealWorkspacePageProps) {
  const { id } = await params;

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
                Deal ID: {id}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                A visible workspace shell for structuring one lending
                opportunity from intake through submission.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Status: In progress
          </div>
        </div>
      </section>

      <WorkspaceTabs />
    </div>
  );
}
