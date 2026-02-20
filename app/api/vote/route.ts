import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server";

type VoteRequest = {
  caption_id?: unknown;
  vote?: unknown;
};

export async function POST(req: Request) {
  try {
    const supabase = await createRouteClient();

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = (await req.json()) as VoteRequest;
    const caption_id = body.caption_id;
    const vote = body.vote; // expected: 1 or -1

    if (
      typeof caption_id !== "string" ||
      caption_id.length === 0 ||
      (vote !== 1 && vote !== -1)
    ) {
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
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
