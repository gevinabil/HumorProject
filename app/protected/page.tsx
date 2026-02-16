import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold mb-6">Welcome back.</h1>
        <p className="text-xl text-gray-400 mb-16">Choose a week below.</p>

        <div className="grid md:grid-cols-2 gap-10">
          <Link href="/week-1">
            <div className="p-10 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition cursor-pointer">
              <h2 className="text-3xl font-semibold">Week 1</h2>
              <p className="text-gray-400 mt-2">Hello World</p>
            </div>
          </Link>

          <Link href="/week-2">
            <div className="p-10 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition cursor-pointer">
              <h2 className="text-3xl font-semibold">Week 2</h2>
              <p className="text-gray-400 mt-2">Connecting the Database</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
