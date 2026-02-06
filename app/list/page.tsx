import { supabase } from "@/lib/supabase";

export default async function ListPage() {
  const { data, error } = await supabase
    .from("caption_examples")
    .select("*")
    .limit(50);

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1 style={{ fontSize: 32 }}>List</h1>
        <p style={{ marginTop: 12, color: "crimson" }}>
          Error: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 32 }}>List</h1>
      <ul style={{ marginTop: 16 }}>
        {(data ?? []).map((row: any, i: number) => (
          <li
            key={row.id ?? i}
            style={{ padding: 12, borderBottom: "1px solid #eee" }}
          >
            <pre style={{ margin: 0 }}>{JSON.stringify(row, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </main>
  );
}

