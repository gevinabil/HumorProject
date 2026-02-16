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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
        <h1 className="text-3xl font-semibold mb-6">Sign in</h1>
        <button
          onClick={signIn}
          className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:opacity-90 transition"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
