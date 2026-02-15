import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/");

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <div style={{ width: "min(720px, 100%)" }}>
        <h1 style={{ fontSize: 44, marginBottom: 8 }}>Welcome</h1>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>Choose a week:</p>

        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/week-1" style={btnStyle}>Week 1</Link>
          <Link href="/week-2" style={btnStyle}>Week 2</Link>
        </div>
      </div>
    </main>
  );
}

const btnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 18px",
  borderRadius: 12,
  border: "1px solid #ddd",
  textDecoration: "none",
  fontWeight: 600,
};
