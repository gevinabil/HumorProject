import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Week2Page() {
  const supabase = await createClient();

  // gate it (only logged-in users can see Week 2)
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/");

  // fetch your caption examples table (rename if your table name differs)
  const { data: rows, error } = await supabase
    .from("caption_examples")
    .select("id, caption, explanation, image_description, created_datetime_utc")
    .order("id", { ascending: true });

  if (error) {
    return (
      <main style={{ padding: 32 }}>
        <Link href="/protected">← Back</Link>
        <h1 style={{ fontSize: 40, marginTop: 16 }}>Week 2</h1>
        <p style={{ color: "crimson" }}>Error: {error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 32 }}>
      <Link href="/protected">← Back</Link>
      <h1 style={{ fontSize: 44, marginTop: 16, marginBottom: 16 }}>Caption examples</h1>

      <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <Th>ID</Th>
              <Th>Caption</Th>
              <Th>Explanation</Th>
              <Th>Image description</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r: any) => (
              <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                <Td>{r.id}</Td>
                <Td>{r.caption}</Td>
                <Td>{r.explanation}</Td>
                <Td>{r.image_description}</Td>
                <Td>{r.created_datetime_utc}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: "left", padding: "12px 14px", fontSize: 13, letterSpacing: 0.2 }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px 14px", verticalAlign: "top" }}>{children}</td>;
}
