import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WeekDashboard from "./WeekDashboard";

export const dynamic = "force-dynamic";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) redirect("/");

  return <WeekDashboard email={data.user.email} />;
}
