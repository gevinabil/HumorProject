import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// IMPORTANT: set this to your real table name if different.
const TABLE = "caption_examples";

type Row = {
  id: string;
  caption: string | null;
  explanation: string | null;
};

export default async function Week2Page() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("id, caption, explanation")
    .order("id", { ascending: false })
    .limit(50);

  const rows = (data ?? []) as Row[];

  return (
    <main className="startup-shell">
      <div className="pointer-events-none absolute right-[-210px] top-36 h-72 w-[520px] rotate-12 bg-gradient-to-r from-[#ff1248] to-[#ff3d6e] opacity-20" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/protected"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-sm text-white/85 hover:bg-black/65"
          >
            ← Back
          </Link>

          <div className="text-sm text-white/50">
            {error ? "DB status: error" : `DB status: ok (${rows.length} rows)`}
          </div>
        </div>

        <div className="mb-8">
          <div className="text-sm uppercase tracking-[0.2em] text-[#ff6f93]">Week 2</div>
          <h1 className="mt-2 text-5xl font-black uppercase tracking-tight md:text-6xl">
            Database Read
          </h1>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
            <div className="font-medium mb-1">Failed to load data</div>
            <div className="text-sm opacity-90">
              {error.message}
            </div>
            <div className="text-sm opacity-70 mt-2">
              If your table name is not <span className="font-mono">{TABLE}</span>, update the TABLE constant at the top of this file.
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-black/20 bg-[#f4f4f4] text-black shadow-[0_20px_65px_rgba(0,0,0,.4)]">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white">
                  <tr className="text-left text-xs uppercase tracking-wider text-black/60">
                    <th className="px-5 py-4 w-[40%]">ID</th>
                    <th className="px-5 py-4 w-[30%]">Caption</th>
                    <th className="px-5 py-4 w-[30%]">Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-black/10">
                      <td className="px-5 py-4 align-top text-sm text-black/70 font-mono break-all">
                        {r.id}
                      </td>
                      <td className="px-5 py-4 align-top text-sm text-black/85">
                        {r.caption ?? <span className="text-black/35">—</span>}
                      </td>
                      <td className="px-5 py-4 align-top text-sm text-black/70">
                        {r.explanation ?? <span className="text-black/35">—</span>}
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-5 py-10 text-center text-black/50">
                        No rows returned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
