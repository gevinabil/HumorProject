import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createRouteClient();

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const caption_id = body?.caption_id;
    const vote = body?.vote; // expected: 1 or -1

    if (!caption_id || (vote !== 1 && vote !== -1)) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    // Insert a new row into caption_votes
    const { error } = await supabase.from("caption_votes").insert({
      caption_id,
      user_id: user.id,
      vote,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
