"use client";

import { useMemo, useState } from "react";
import VoteButtons from "./VoteButtons";

export type VoteItem = {
  id: string;
  caption: string;
  explanation: string | null;
  imageUrl: string | null;
};

export default function VotingQueue({ items }: { items: VoteItem[] }) {
  const [index, setIndex] = useState(0);

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
      <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-6 text-emerald-100">
        <p className="text-lg font-semibold">All captions rated.</p>
        <p className="mt-2 text-sm text-emerald-100/80">
          You have submitted votes for all {total} captions.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-xs uppercase tracking-wider text-white/60">
        Caption {progressLabel}
      </div>

      <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="relative aspect-[4/3] w-full bg-white/5">
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
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm leading-6 text-white/90">{current.caption}</p>
          {current.explanation ? (
            <p className="text-xs text-white/60">{current.explanation}</p>
          ) : null}
          <VoteButtons
            captionId={current.id}
            onVoted={() => setIndex((value) => value + 1)}
          />
        </div>
      </article>
    </div>
  );
}
