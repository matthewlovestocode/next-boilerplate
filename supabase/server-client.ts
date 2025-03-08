import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Create supabase client for next js server.
 */
export async function createSupabaseServerClient(token: string) {
  const cookieStore = await cookies();
  return  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
      },
      global: {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      },
    }
  )
}
