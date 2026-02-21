import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/app/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) redirect("/");

  return (
    <div className="startup-shell">
      <div className="pointer-events-none absolute right-[-220px] top-32 h-72 w-[540px] rotate-12 bg-gradient-to-r from-[#ff1248] to-[#ff3d6e] opacity-20" />

      <div className="absolute top-6 right-6 z-10">
        <SignOutButton />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-24">
        <p className="text-sm uppercase tracking-[0.2em] text-[#ff6f93]">Dashboard</p>
        <h1 className="mt-3 text-6xl font-black uppercase tracking-tight">Welcome back.</h1>
        <p className="mb-12 mt-4 text-white/65">Choose a week below.</p>

        <div className="grid gap-8 md:grid-cols-3">
          <Link
            href="/week-1"
            className="rounded-3xl border border-black/20 bg-[#f4f4f4] p-8 text-black shadow-[0_18px_55px_rgba(0,0,0,.35)] transition hover:-translate-y-1"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff1248]">Week 1</p>
            <h2 className="mt-2 text-2xl font-bold">Hello World</h2>
            <p className="mt-2 text-black/60">Animated intro challenge</p>
          </Link>

          <Link
            href="/week-2"
            className="rounded-3xl border border-black/20 bg-[#f4f4f4] p-8 text-black shadow-[0_18px_55px_rgba(0,0,0,.35)] transition hover:-translate-y-1"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff1248]">Week 2</p>
            <h2 className="mt-2 text-2xl font-bold">Database Read</h2>
            <p className="mt-2 text-black/60">Connected Supabase listing</p>
          </Link>

          <Link
            href="/week-4"
            className="rounded-3xl border border-[#ff3d6e]/40 bg-[#ff1248] p-8 text-white shadow-[0_18px_55px_rgba(255,18,72,.35)] transition hover:-translate-y-1"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Week 4</p>
            <h2 className="mt-2 text-2xl font-black">Mutating Data</h2>
            <p className="mt-2 text-white/85">Caption voting experience</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
