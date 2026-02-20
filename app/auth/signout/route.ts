import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createRouteClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', request.url))
}
