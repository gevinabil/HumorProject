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

      const json: {
        error?: string;
        code?: string;
        details?: string;
        hint?: string;
      } = await res.json();

      if (!res.ok) {
        const detail = [json.error, json.code, json.details]
          .filter(Boolean)
          .join(" | ");
        setMsg(detail || "Vote failed");
      } else {
        setMsg("Saved ✓");
        setTimeout(() => {
          onVoted?.();
        }, 250);
      }
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          disabled={loading}
          onClick={() => vote(1)}
          className="rounded-md bg-[#ff1248] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_22px_rgba(255,18,72,.35)] hover:bg-[#ff2b5f] disabled:opacity-50 transition"
        >
          {loading ? "Saving..." : "Yes"}
        </button>
        <button
          disabled={loading}
          onClick={() => vote(-1)}
          className="rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-black/75 hover:bg-black/5 disabled:opacity-50 transition"
        >
          {loading ? "Saving..." : "No"}
        </button>
      </div>
      {msg && <p className="text-xs text-black/60 break-words">{msg}</p>}
    </div>
  );
}
