import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerAdminClient } from '@/supabase/admin-client'
import { AppUser, AppUserRole } from '@/lib/types';

/**
 * Promote a user to admin.
 * Requires a request authorization token from a user with an admin role.
 * The admin role requirement is bypassed if no users with the admin role exist.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { userId, role } = await req.json();

    // Return error if request body does not contain user id for user to promote
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Return error if request body does not contain new role
    if (!role) {
      return NextResponse.json({ error: "role is required" }, { status: 400 });
    }

    // Return error if role is not a correct type
    if (![AppUserRole.ADMIN, AppUserRole.AUTHENTICATED].includes(role)) {
      if (!role) {
        return NextResponse.json({ error: "role is invalid" }, { status: 400 });
      }
    }

    // Parse request authorization header
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

    // Determine admin user count
    const adminCount = data.users.filter((user) => {
      const appUser = user as AppUser;
      return appUser.app_metadata.role === AppUserRole.ADMIN;
    }).length;

    
    // Determine promotion entitlement and requirements
    const promotionRequiresAdmin = adminCount > 0;
    const requesterIsAdmin = (user as AppUser).app_metadata.role === AppUserRole.ADMIN;

    // Return error if admin role is required and requesting user is not admin
    if (promotionRequiresAdmin && !requesterIsAdmin) {
      return NextResponse.json({ error: "You do not have permission to perform this action" }, { status: 403 });
    }

    // Promote user according to user id in request body
    const { data: promotedUser, error: promotionError } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role },
    });

    // Return error if supabase fails to update user
    if (promotionError) {
      console.error(`Error promoting user to ${role}:`, promotionError);
      return NextResponse.json({ error: promotionError.message }, { status: 500 });
    }

    // Success
    return NextResponse.json({ message: `User promoted to ${role}`, user: promotedUser });
    
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
