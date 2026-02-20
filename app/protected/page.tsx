import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/app/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) redirect("/");

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 25%, rgba(99,102,241,.25), transparent 60%), radial-gradient(900px 500px at 85% 35%, rgba(236,72,153,.18), transparent 60%), radial-gradient(1100px 600px at 50% 100%, rgba(34,197,94,.10), transparent 55%)",
        }}
      />

      <div className="absolute top-6 right-6 z-10">
        <SignOutButton />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-24 px-6">
        <h1 className="text-6xl font-bold mb-4">Welcome back.</h1>
        <p className="text-white/60 mb-12">Choose a week below.</p>

        <div className="grid md:grid-cols-3 gap-8">
          <Link
            href="/week-1"
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:bg-white/10 transition"
          >
            <h2 className="text-2xl font-semibold mb-2">Week 1</h2>
            <p className="text-white/50">Hello World</p>
          </Link>

          <Link
            href="/week-2"
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:bg-white/10 transition"
          >
            <h2 className="text-2xl font-semibold mb-2">Week 2</h2>
            <p className="text-white/50">Connecting the Database</p>
          </Link>

          <Link
            href="/week-4"
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:bg-white/10 transition"
          >
            <h2 className="text-2xl font-semibold mb-2">Week 4</h2>
            <p className="text-white/50">Mutating Data (votes)</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
