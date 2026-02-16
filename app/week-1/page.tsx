import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Week1Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <Link
            href="/protected"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            ← Back
          </Link>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-10">
          <div className="text-white/60 text-sm mb-3">Week 1</div>
          <h1 className="text-6xl md:text-7xl font-semibold tracking-tight">
            Hello World
          </h1>
          <p className="mt-4 text-xl text-white/60">Clean. Big. Aesthetic.</p>
        </section>
      </div>
    </main>
  );
}
