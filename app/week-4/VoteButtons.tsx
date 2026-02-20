"use client";

import { useState } from "react";

export default function VoteButtons({ captionId }: { captionId: string }) {
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
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
      >
        👍 Upvote
      </button>
      <button
        disabled={loading}
        onClick={() => vote(-1)}
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
      >
        👎 Downvote
      </button>
      {msg && <span className="text-xs text-white/60">{msg}</span>}
    </div>
  );
}
