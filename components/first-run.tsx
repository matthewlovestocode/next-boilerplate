'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import { supabase } from '@/supabase/browser-client'

export default function FirstRun() {
  const [adminCount, setAdminCount] = useState<number | null>(null);
  const { user, isLoading: userIsLoading } = useAuth();

  const handleSelfPromote = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (token) {
      const res = await fetch('/api/users/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?.id,
          role: 'admin'
        })
      });

      if (res.ok) {
        const data = await res.json();
        console.log('promote res:', data);
      }
    }
  }

  useEffect(() => {
    if (!user || userIsLoading) return;

    const fetchAdminCount = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (token) {
        const res = await fetch('/api/roles/admin/count', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data: { count: number } = await res.json();
          console.log('admin count:', data.count);
          setAdminCount(data.count);
        }
      }
    };

    fetchAdminCount();
  }, [userIsLoading]);

  return (
    <>
      <Paper
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>

          <Stack spacing={2}>
            <Typography variant="h5">
              Hello {user?.email}!
            </Typography>

            {adminCount && adminCount > 0 && (
              <Typography variant="body1">
                It appears an admin has already been set.
                Please contact your admin.
              </Typography>
            )}

            {adminCount && adminCount === 0 && (
              <>
                <Typography variant="body1">
                  No admin user has been set to manage user roles.  Promote yourself to an admin.
                </Typography>

                <Box>
                  <Button variant="contained" onClick={handleSelfPromote} sx={{ mt: 2, mr: 1 }}>
                    Promote Self
                  </Button>
                </Box>
              </>
            )}

          </Stack>
        </Box>
      </Paper>
    </>
  );
}
