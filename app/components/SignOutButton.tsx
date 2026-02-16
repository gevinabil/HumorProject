"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function SignOutButton() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition backdrop-blur-md"
    >
      Sign out
    </button>
  );
}
