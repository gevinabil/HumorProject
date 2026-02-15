import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignIn from "@/app/components/SignIn";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) redirect("/protected");

  return <SignIn />;
}
