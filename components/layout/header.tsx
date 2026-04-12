import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/deals/new", label: "New Deal" },
  { href: "/settings", label: "Settings" },
  { href: "/sign-in", label: "Sign In" },
];

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
            Credit Engine V2
          </Link>
          <p className="text-sm text-slate-500">
            Deal workspace for commercial lending opportunities
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
