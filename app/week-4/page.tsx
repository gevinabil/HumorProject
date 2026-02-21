import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VotingQueue, { type VoteItem } from "./VotingQueue";

export const dynamic = "force-dynamic";
const CAPTIONS_TABLE = "captions";
const IMAGES_TABLE = "images";

type CaptionRow = {
  id: string;
  content: string | null;
  image_id: string | null;
};

type ImageRow = {
  id?: string | null;
  url: string | null;
  image_description: string | null;
};

function shuffleItems<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default async function Week4Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) redirect("/");

  // Read caption rows to keep vote IDs aligned with caption_votes.caption_id.
  const { data: captions, error } = await supabase
    .from(CAPTIONS_TABLE)
    .select("id, content, image_id")
    .order("id", { ascending: false });

  // Pair captions with images by image_id -> images.id.
  const imageIds = Array.from(
    new Set(
      (captions ?? [])
        .map((row) => (row as CaptionRow).image_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    )
  );

  const imagesById = new Map<string, ImageRow>();
  if (imageIds.length > 0) {
    const chunkSize = 100;

    for (let i = 0; i < imageIds.length; i += chunkSize) {
      const chunk = imageIds.slice(i, i + chunkSize);
      const { data: images, error: imagesError } = await supabase
        .from(IMAGES_TABLE)
        .select("id, url, image_description")
        .in("id", chunk);

      if (imagesError) {
        break;
      }

      for (const row of ((images as ImageRow[] | null) ?? [])) {
        if (row.id) imagesById.set(row.id, row);
      }
    }
  }

  const items: VoteItem[] = ((captions as CaptionRow[] | null) ?? []).reduce<VoteItem[]>(
    (acc, row) => {
      const linkedImage = row.image_id ? imagesById.get(row.image_id) : undefined;
      const caption = row.content ?? linkedImage?.image_description ?? "No caption";
      const explanation = linkedImage?.image_description ?? null;
      const imageUrl = linkedImage?.url ?? null;

      if (!imageUrl) {
        return acc;
      }

      acc.push({
        id: row.id,
        caption,
        explanation,
        imageUrl,
      });

      return acc;
    },
    []
  );
  const randomizedItems = shuffleItems(items);

  return (
    <div className="min-h-screen w-full bg-[#0b0b0e] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_15%_12%,rgba(255,16,56,.20),transparent_65%),radial-gradient(1000px_500px_at_88%_8%,rgba(255,48,92,.12),transparent_65%)]" />
      <div className="pointer-events-none absolute left-[-160px] top-20 h-64 w-[460px] -rotate-12 bg-gradient-to-r from-[#ff1248] to-[#ff3d6e] opacity-80" />
      <div className="pointer-events-none absolute right-[-200px] top-36 h-72 w-[520px] rotate-12 bg-gradient-to-r from-[#ff1248] to-[#ff3d6e] opacity-25" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10 sm:pt-14">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link
            href="/protected"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-medium text-white/80 hover:bg-black/50 hover:text-white transition"
          >
            ← Back
          </Link>
          <p className="hidden text-sm text-white/50 sm:block">{auth.user.email}</p>
        </header>

        <section className="mt-10 grid gap-8 md:grid-cols-[1.2fr_.8fr] md:items-end">
          <div>
            <p className="inline-flex rounded-full border border-[#ff3d6e]/50 bg-[#ff1248]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#ff6f93]">
              Week 4 Challenge
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Vote The Caption.
            </h1>
            <p className="mt-4 max-w-xl text-white/65">
              Review one image at a time and decide if the caption is a hit.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Session</p>
            <p className="mt-2 text-lg font-semibold text-white/90">Caption Arena</p>
            <p className="mt-1 text-sm text-white/60">Authenticated rating mode enabled.</p>
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-[28px] border border-black/10 bg-[#f4f4f4] text-[#111] shadow-[0_24px_80px_rgba(0,0,0,.45)]">
          <div className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff1248]">
                Matchday Panel
              </p>
              <p className="mt-1 text-sm font-semibold text-black/70">Caption vs Image</p>
            </div>
            <div className="text-xs text-black/50 sm:hidden">{auth.user.email}</div>
          </div>

          <div className="bg-[linear-gradient(0deg,rgba(0,0,0,.035)_1px,transparent_1px)] bg-[length:100%_22px] p-6 sm:p-8">
            {error && (
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-900">
                Failed to load captions: {error.message}
              </div>
            )}

            {!error && randomizedItems.length === 0 && (
              <div className="text-sm text-black/55">No captions found.</div>
            )}

            {!error && randomizedItems.length > 0 && (
              <VotingQueue items={randomizedItems} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
