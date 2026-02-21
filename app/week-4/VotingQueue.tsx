"use client";

import { useMemo, useState } from "react";

export type VoteItem = {
  id: string;
  caption: string;
  explanation: string | null;
  imageUrl: string | null;
};

export default function VotingQueue({ items }: { items: VoteItem[] }) {
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const current = items[index];
  const total = items.length;
  const done = index >= total;

  const progressLabel = useMemo(() => {
    if (total === 0) return "0 / 0";
    return `${Math.min(index + 1, total)} / ${total}`;
  }, [index, total]);

  if (total === 0) {
    return <div className="text-white/60 text-sm">No captions found.</div>;
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[#ff1248]/30 bg-white p-6 text-black">
        <p className="text-lg font-semibold">All captions rated.</p>
        <p className="mt-2 text-sm text-black/65">
          You have submitted votes for all {total} captions.
        </p>
      </div>
    );
  }

  async function submitVote(v: 1 | -1) {
    if (submitting) return;
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption_id: current.id, vote: v }),
      });

      const json: {
        error?: string;
        code?: string;
        details?: string;
      } = await res.json();

      if (!res.ok) {
        const detail = [json.error, json.code, json.details].filter(Boolean).join(" | ");
        setMsg(detail || "Vote failed");
        setSubmitting(false);
        return;
      }

      setMsg("Saved");
      await new Promise((resolve) => setTimeout(resolve, 120));
      setIndex((value) => value + 1);
      setSubmitting(false);
    } catch {
      setMsg("Network error");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="inline-flex items-center rounded-full border border-[#ff1248]/40 bg-[#ff1248]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#c80f3a]">
        Caption {progressLabel}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ff1248] to-[#ff3d6e] transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <article className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_20px_65px_rgba(0,0,0,.18)]">
        <div className="relative aspect-[16/10] w-full bg-black/5">
          {current.imageUrl ? (
            <img
              src={current.imageUrl}
              alt={current.caption}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/40">
              No image available
            </div>
          )}
          {submitting ? (
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.35),transparent_45%)]" />
        </div>

        <div className="space-y-4 p-6 sm:p-7">
          <p className="text-xl font-semibold leading-8 text-black">{current.caption}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={submitting}
              onClick={() => submitVote(-1)}
              className="rounded-xl border border-[#ff4d7b]/35 bg-gradient-to-b from-[#ff5b88] to-[#e1124a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(255,18,72,.3)] transition hover:brightness-105 disabled:opacity-60"
            >
              No
            </button>
            <button
              disabled={submitting}
              onClick={() => submitVote(1)}
              className="rounded-xl border border-[#2ec17b]/35 bg-gradient-to-b from-[#5fdf9f] to-[#1f9d62] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(38,190,120,.3)] transition hover:brightness-105 disabled:opacity-60"
            >
              Yes
            </button>
          </div>
          {msg ? (
            <p className="text-xs text-black/60 break-words">{msg}</p>
          ) : (
            <p className="text-xs uppercase tracking-[0.13em] text-black/45">
              Tap the left or right lane to vote
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
