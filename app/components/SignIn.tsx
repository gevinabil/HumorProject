"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setError(error.message);
    else setSent(true);
  }

  async function signInWithGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <div style={{ width: 480, maxWidth: "100%", border: "1px solid #ddd", borderRadius: 18, padding: 24 }}>
        <h1 style={{ fontSize: 34, marginBottom: 6 }}>Sign in</h1>
        <p style={{ opacity: 0.7, marginBottom: 18 }}>Sign in to access Week 1 & Week 2.</p>

        <button onClick={signInWithGoogle} style={btnPrimary}>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
          <div style={{ height: 1, background: "#eee", flex: 1 }} />
          <div style={{ opacity: 0.6 }}>or</div>
          <div style={{ height: 1, background: "#eee", flex: 1 }} />
        </div>

        <form onSubmit={signInWithEmail}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@columbia.edu"
            style={inputStyle}
          />
          <button type="submit" style={btnBlack}>
            Email me a magic link
          </button>
        </form>

        {sent && <p style={{ marginTop: 12 }}>Check your email for the magic link.</p>}
        {error && <p style={{ marginTop: 12, color: "crimson" }}>Error: {error}</p>}
      </div>
    </main>
  );
}

const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const btnBlack: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #111",
  background: "#111",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 12,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  outline: "none",
};
