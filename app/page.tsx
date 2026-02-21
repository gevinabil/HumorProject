"use client";

import { createBrowserClientInstance } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = createBrowserClientInstance();

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main className="startup-shell">
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.15fr_.85fr]">
        <section>
          <p className="inline-flex rounded-full border border-[#ff3d6e]/50 bg-[#ff1248]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6f93]">
            The Humor Project
          </p>
          <h1 className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Rate Captions.
          </h1>
          <p className="mt-5 max-w-xl text-white/65">
            Sign in to access all weeks and submit votes on image-caption pairs.
          </p>
        </section>

        <section className="rounded-[28px] border border-black/20 bg-[#f4f4f4] p-7 text-black shadow-[0_24px_80px_rgba(0,0,0,.45)] sm:p-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff1248]">
            Member Access
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Sign in</h2>
          <p className="mt-2 text-sm text-black/65">Use Google to continue.</p>

          <button
            onClick={signIn}
            className="mt-8 w-full rounded-md bg-[#ff1248] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_22px_rgba(255,18,72,.35)] hover:bg-[#ff2b5f] transition"
          >
            Continue with Google
          </button>
        </section>
      </div>
    </main>
  );
}
