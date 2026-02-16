import Link from "next/link";

export default function AppShell({
  title,
  subtitle,
  backHref,
  rightSlot,
  children,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {backHref ? (
              <Link
                href={backHref}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                ← Back
              </Link>
            ) : null}

            <div>
              <p className="text-white/60 text-sm tracking-wide">Humor Project</p>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-white/60">{subtitle}</p>
              ) : null}
            </div>
          </div>

          {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
        </header>

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
