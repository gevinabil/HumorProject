"use client";

import { useState } from "react";

export default function VoteButtons({
  captionId,
  onVoted,
}: {
  captionId: string;
  onVoted?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const vote = async (v: 1 | -1) => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption_id: captionId, vote: v }),
      });

      const json = await res.json();

      if (!res.ok) {
        setMsg(json?.error ?? "Vote failed");
      } else {
        setMsg("Saved ✓");
        onVoted?.();
      }
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 1200);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={loading}
        onClick={() => vote(1)}
        className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-50"
      >
        Yes
      </button>
      <button
        disabled={loading}
        onClick={() => vote(-1)}
        className="rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100 hover:bg-rose-500/20 disabled:opacity-50"
      >
        No
      </button>
      {msg && <span className="text-xs text-white/60">{msg}</span>}
    </div>
  );
}
