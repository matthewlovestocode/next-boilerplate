import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Create supabase client for next js server that bypasses supabase RLS for admin override.
 * Do not expose to next js client code.
 */
export async function createSupabaseServerAdminClient(token: string) {
  const cookieStore = await cookies();
  return  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      }
    }
  )
}
