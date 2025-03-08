import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerAdminClient } from '@/supabase/admin-client'

/**
 * Get all users.  Requires admin role.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    
    // Return error if header is not formatted correctly
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }

    // Pass token as auth header in supabase client 
    const token = authHeader.replace('Bearer ', '');
    const supabase = await createSupabaseServerAdminClient(token);

    // Check if a user exists with the token
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    // Return error if token is invalid, expired, or if user does not exist
    if (getUserError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Fetch all users with admin privilege
    const { data, error } = await supabase.auth.admin.listUsers();

    // Return error if supabase query fails 
    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Success
    return NextResponse.json(data.users);
    
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
