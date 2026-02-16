"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSignOut() {
    try {
      setLoading(true);
      const res = await fetch("/auth/signout", { method: "POST" });
      if (!res.ok) throw new Error("Sign out failed");
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Could not sign out. Check server logs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onSignOut}
      disabled={loading}
      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10 disabled:opacity-60"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
