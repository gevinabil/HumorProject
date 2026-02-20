import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * For Server Components (read-only cookies):
 * - CAN read cookies
 * - MUST NOT write cookies (Next will throw)
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // IMPORTANT: do not set cookies in Server Components
        setAll() {},
      },
    }
  );
}

/**
 * For Route Handlers (app/ROUTE_HANDLER/route.ts):
 * - CAN read/write cookies
 */
export async function createRouteClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}
