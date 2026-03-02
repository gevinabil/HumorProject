"use client";

import { useState } from "react";
import { createBrowserClientInstance } from "@/lib/supabase/browser";

const BUTTON_POSITIONS = [
  { x: 50, y: 34 },
  { x: 24, y: 72 },
  { x: 78, y: 58 },
  { x: 50, y: 50 },
];

export default function LoginPage() {
  const supabase = createBrowserClientInstance();
  const [attempts, setAttempts] = useState(0);
  const [buttonPosition, setButtonPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  async function handleSignInClick() {
    if (loading) return;

    if (attempts < 3) {
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);
      setButtonPosition(nextAttempt);
      return;
    }

    setLoading(true);
    setMessage("Connecting your account...");
    await new Promise((resolve) => setTimeout(resolve, 350));
    await signIn();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050607] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_650px_at_16%_10%,rgba(255,255,255,.07),transparent_65%),radial-gradient(900px_550px_at_84%_14%,rgba(255,255,255,.04),transparent_70%)]" />
      <div className="pointer-events-none absolute left-[-220px] top-20 h-72 w-[520px] -rotate-12 bg-white/[0.06]" />
      <div className="pointer-events-none absolute right-[-180px] top-32 h-72 w-[520px] rotate-12 bg-white/[0.04]" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_.9fr]">
        <section className="space-y-5">
          <p className="inline-flex rounded-full border border-white/20 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Humor Project
          </p>
          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Caption Lab.
          </h1>
          <p className="max-w-xl text-white/62">
            Sign in to access weekly assignments, vote on captions, and upload your own images for generation.
          </p>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_80px_rgba(0,0,0,.45)] backdrop-blur-xl sm:p-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">
            Member Access
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">Sign in</h2>
          <p className="mt-2 text-sm text-white/58">Use Google to continue.</p>

          <div className="relative mt-8 h-40 rounded-2xl border border-white/10 bg-black/35">
            <button
              onClick={handleSignInClick}
              disabled={loading}
              style={{
                left: `${BUTTON_POSITIONS[buttonPosition].x}%`,
                top: `${BUTTON_POSITIONS[buttonPosition].y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute rounded-xl border border-white/25 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-all duration-500 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {loading ? "Redirecting..." : "Continue with Google"}
            </button>
          </div>

          {message ? (
            <p className="mt-4 text-sm font-semibold text-white/72">{message}</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
