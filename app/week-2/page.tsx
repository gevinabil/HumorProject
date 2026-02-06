import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // avoid static caching issues on Vercel

type CaptionExample = {
  id: number;
  image_description: string | null;
  caption: string | null;
  explanation: string | null;
  priority: number | null;
  created_datetime_utc: string | null;
};

export default async function Week2Page() {
  const { data, error } = await supabase
    .from("caption_examples")
    .select("id, image_description, caption, explanation, priority, created_datetime_utc")
    .order("id", { ascending: true })
    .limit(50);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Caption Examples</h1>
            <p className="mt-1 text-zinc-600">Week 2 (Supabase → Table)</p>
          </div>

          <Link href="/" className="text-sm text-zinc-600 underline hover:text-zinc-900">
            ← Back
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          {error ? (
            <div className="p-6 text-red-700">
              <div className="font-semibold">Error fetching data</div>
              <div className="mt-2 text-sm">{error.message}</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700">
                  <tr>
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Caption</th>
                    <th className="p-4 font-semibold">Explanation</th>
                    <th className="p-4 font-semibold">Image Description</th>
                    <th className="p-4 font-semibold">Priority</th>
                    <th className="p-4 font-semibold">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {(data as CaptionExample[] | null)?.map((row) => (
                    <tr key={row.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 align-top">
                      <td className="p-4 text-zinc-700">{row.id}</td>
                      <td className="p-4 font-medium">{row.caption ?? "—"}</td>
                      <td className="p-4 text-zinc-700 max-w-xl">{row.explanation ?? "—"}</td>
                      <td className="p-4 text-zinc-700 max-w-xl">{row.image_description ?? "—"}</td>
                      <td className="p-4 text-zinc-700">{row.priority ?? "—"}</td>
                      <td className="p-4 text-zinc-500">
                        {row.created_datetime_utc
                          ? new Date(row.created_datetime_utc).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}

                  {(!data || data.length === 0) && (
                    <tr>
                      <td className="p-8 text-zinc-600" colSpan={6}>
                        No rows found in caption_examples.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
