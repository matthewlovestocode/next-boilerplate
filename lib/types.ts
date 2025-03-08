import { User } from '@supabase/supabase-js'

export enum AppUserRole {
  "ADMIN" = "admin",
  "AUTHENTICATED" = "authenticated"
}

export type AppUser = User & {
  app_metadata: {
    provider: string;
    role: AppUserRole;
  };
}
