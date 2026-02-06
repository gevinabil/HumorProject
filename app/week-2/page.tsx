import { supabase } from "@/lib/supabase";

export default async function Week2() {
  const { data, error } = await supabase
    .from("caption_examples")
    .select("*");

  if (error) {
    return <p className="text-red-600">Error loading data</p>;
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">Caption Examples</h1>

      <table className="w-full border border-zinc-300">
        <thead className="bg-zinc-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Caption</th>
            <th className="border p-2">Explanation</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="border p-2">{row.id}</td>
              <td className="border p-2">{row.caption}</td>
              <td className="border p-2">{row.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

