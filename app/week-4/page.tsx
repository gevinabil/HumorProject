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

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 25%, rgba(99,102,241,.25), transparent 60%), radial-gradient(900px 500px at 85% 35%, rgba(236,72,153,.18), transparent 60%), radial-gradient(1100px 600px at 50% 100%, rgba(34,197,94,.10), transparent 55%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-24">
        <Link
          href="/protected"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
        >
          ← Back
        </Link>

        <div className="mt-10">
          <p className="text-white/60 text-sm mb-2">Week 4</p>
          <h1 className="text-5xl font-bold">Mutating Data</h1>
          <p className="text-white/60 mt-3">Rate each caption as Yes or No.</p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-white/80 font-medium">Captions</div>
            <div className="text-white/50 text-sm">
              Logged in as {auth.user.email}
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="text-red-300 text-sm">
                Failed to load captions: {error.message}
              </div>
            )}

            {!error && items.length === 0 && (
              <div className="text-white/60 text-sm">No captions found.</div>
            )}

            {!error && items.length > 0 && (
              <VotingQueue items={items} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
