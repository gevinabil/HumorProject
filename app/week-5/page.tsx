import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateYourOwn from "./CreateYourOwn";

export const dynamic = "force-dynamic";

export default async function Week5Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) redirect("/");

  return (
    <div className="min-h-screen w-full bg-[#060708] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_700px_at_15%_8%,rgba(255,255,255,.07),transparent_65%),radial-gradient(900px_600px_at_80%_10%,rgba(255,255,255,.04),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 pb-28 pt-10 sm:pt-14">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link
            href="/protected"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/[0.09] hover:text-white transition"
          >
            ← Back
          </Link>
          <p className="hidden text-sm text-white/50 sm:block">{auth.user.email}</p>
        </header>

        <section className="mt-10 grid gap-8 md:grid-cols-[1.2fr_.8fr] md:items-end">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
              Week 5 Challenge
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Create Your Own.
            </h1>
            <p className="mt-4 max-w-xl text-white/62">
              This app writes a caption for your image. Upload one image, then click Generate Captions to get a result.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
            <div className="h-1.5 w-44 rounded-full bg-indigo-300/80" />
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Session</p>
            <p className="mt-2 text-lg font-semibold text-white/90">Caption Pipeline</p>
            <p className="mt-1 text-sm text-white/58">Authenticated upload mode enabled.</p>
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-black/35 text-white shadow-[0_24px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
          <div className="border-b border-white/10 bg-white/[0.02] px-6 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">
              Upload + Generate
            </p>
            <p className="mt-1 text-sm font-semibold text-white/75">Follow the two steps below to create a caption.</p>
          </div>

          <div className="p-6 sm:p-8">
            <CreateYourOwn />
          </div>
        </section>
      </div>
    </div>
  );
}
