import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VoteButtons from "./VoteButtons";

export const dynamic = "force-dynamic";

type CaptionRow = {
  id: string;
  caption: string | null;
  explanation: string | null;
};

export default async function Week4Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) redirect("/");

  // Read captions (same table you used in Week 2)
  const { data: captions, error } = await supabase
    .from("captions")
    .select("id, caption, explanation")
    .order("id", { ascending: false });

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
          <p className="text-white/60 mt-3">
            Vote on captions. Votes are inserted into <span className="text-white/80">caption_votes</span>.
          </p>
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

            {!error && (!captions || captions.length === 0) && (
              <div className="text-white/60 text-sm">No captions found.</div>
            )}

            {!!captions?.length && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-white/60">
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 pr-4 w-[22%]">ID</th>
                      <th className="text-left py-3 pr-4 w-[28%]">Caption</th>
                      <th className="text-left py-3 pr-4 w-[30%]">Explanation</th>
                      <th className="text-left py-3 w-[20%]">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(captions as CaptionRow[]).map((row) => (
                      <tr key={row.id} className="border-b border-white/10">
                        <td className="py-4 pr-4 text-white/60 font-mono text-xs">
                          {row.id}
                        </td>
                        <td className="py-4 pr-4">{row.caption ?? ""}</td>
                        <td className="py-4 pr-4 text-white/70">{row.explanation ?? ""}</td>
                        <td className="py-4">
                          <VoteButtons captionId={row.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
