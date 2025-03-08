'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography
} from '@mui/material'

export default function AuthForm() {
  const { user, login, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      setError(null);
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setError(null);
      router.push('/dashboard');
    } catch (err) {
      setError('Sign up failed. Try again with a valid email.');
    }
  };

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user]);

  if (user) return null;

  return (
    <>
      {!user && (
        <Paper
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
            <Typography variant="h5">
              Sign In
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button variant="contained" onClick={handleLogin} sx={{ mt: 2, mr: 1 }}>
              Login
            </Button>

            <Button variant="outlined" onClick={handleSignUp} sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
}
