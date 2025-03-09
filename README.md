# Next JS Boilerplate
This serves as a next js app starter.
Features:
- Next JS v15 with App Router
- Material UI
- Light/Dark Mode
- Admin/Roles API
- PWA

# Walkthrough

<details>
<summary>Setup</summary>

## Create Project
```
npx create-next-app@latest next-boilerplate
code next-boilerplate
```

## Strip To Skeleton

### Home Page
Replace the contents of `app/page.tsx` with:
```tsx
export default function Home() {
  return (
    <div>Home Page</div>
  );
}
```

### Public Directory
Remove the image files from the public folder:
```bash
rm public/*.svg
```

</details>



<details>
<summary>MUI</summary>

## Add MUI

### Install Packages
```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/material-nextjs @emotion/cache
```

### Create Theme
Create a file `app/theme.ts`:
```tsx
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
          color: "#ffffff",
        },
      },
    },
  },
});

```

### Create Providers Directory
```bash
mkdir providers
```

### Create Theme Provider
```bash
touch providers/theme-provider.tsx
```
In `providers/theme-provider.tsx`:
```tsx
'use client'

import { ReactNode, createContext, useState, useMemo, useContext, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "@/app/theme";

type ThemeContextType = {
  toggleTheme: () => void;
  mode: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      setMode(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("theme", newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

```

### Create Root Providers
```bash
touch providers/root-providers.tsx
```
In `providers/root-providers.tsx`:
```tsx
'use client'

import ThemeProvider from './theme-provider';

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </>
  );
}

```

### Update Root Layout
In `app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { RootProviders } from '@/providers/root-providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Boilerplate",
  description: "A starting point for application development with Next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <RootProviders>
            {children}
          </RootProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

```

### Remove Global CSS
```bash
rm app/globals.css
```

</details>


<details>
<summary>App Navigation</summary>

## App Navigation
Create a components directory:
```bash
mkdir components
```
Create an app nav component:
```bash
touch components/app-nav.tsx
```
In `components/app-nav.tsx`:
```tsx
'use client'

import { useTheme } from '@/providers/theme-provider'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'

export default function AppNav() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { toggleTheme, mode } = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Next Boilerplate
        </Typography>

        <IconButton color="inherit" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={toggleTheme}>
            <ListItemIcon>
              {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </ListItemIcon>
            {mode === 'light' ? 'Dark Theme' : 'Light Theme'}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

```

### Update Root Layout
In `app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { RootProviders } from '@/providers/root-providers';
import AppNav from '@/components/app-nav';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Boilerplate",
  description: "A starting point for application development with Next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <RootProviders>
            <AppNav />
            {children}
          </RootProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

```


</details>



<details>
<summary>Dark Mode Screen Flicker</summary>

## Remove Screen Flicker
Integrate next-themes to remove dark mode screen flicker on hard refresh.

### Install Next Themes
```bash
npm i next-themes
```

### Update Theme Provider
In `providers/theme-provider.tsx`:
```tsx
'use client'

import { ReactNode, createContext, useContext, useEffect, useState, useMemo } from 'react'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useTheme as useNextTheme } from 'next-themes'
import { lightTheme, darkTheme } from '@/app/theme'

type ThemeContextType = {
  toggleTheme: () => void
  mode: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme, setTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const mode = resolvedTheme === 'dark' ? 'dark' : 'light'

  const muiTheme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode])

  if (!mounted) return <></>

  const toggleTheme = () => {
    setTheme(mode === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

```

### Update Root Layout
In `app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { RootProviders } from '@/providers/root-providers';
import AppNav from '@/components/app-nav';
import { ThemeProvider as NextThemesProvider } from 'next-themes'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Boilerplate",
  description: "A starting point for application development with Next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <NextThemesProvider attribute="class" defaultTheme="system">
            <RootProviders>
              <AppNav />
              {children}
            </RootProviders>
          </NextThemesProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

```

</details>



<details>
<summary>Supabase</summary>

## Setup Supabase
Create an `account` and a `project` as [supabase](https://supabase.com/).  
Three pieces of information are needed in order to connect:
- Supabase URL - The web address to connect to.  Permitted on client.
- Supabase Anon Key - The client friendly service key that works with row level security (RLS).
- Supabase Service Role Key - The server only private key that bypasses RLS, used for setting `app_metadata roles`.

## Create User In Supabase
Create a new user inside of the Supabase GUI, in `Project > Authentication > Add User`.

## Install SSR SDK
```bash
npm i @supabase/ssr
```

## Environment Variables
Create local environment variable file used by next:
```bash
touch .env.local
```
In `.env.local`, add the appropriate url and keys from `Project Settings > Data API`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
```

## Create Supabase Directory
```bash
mkdir supabase
```

## Create Browser Client
```bash
touch supabase/browser-client.ts
```
In `supabase/browser-client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## Create Lib Directory
```bash
mkdir lib
```

## Create Types File
```bash
touch lib/types.ts
```
In `lib/types.ts`:
```ts
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

```

## Create Hooks Directory
```bash
mkdir hooks
```

## Use Auth Hook
```bash
touch hooks/use-auth.ts
```
In `hooks/use-auth.ts`:
```ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/supabase/browser-client'
import { AppUser, AppUserRole } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user as AppUser || null);
      setIsLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as AppUser || null);
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  const isAdmin = user?.app_metadata.role === AppUserRole.ADMIN;

  return { user, login, signUp, logout, isLoading, isAdmin };
}

```


</details>



<details>
<summary>Authentication</summary>

## Create Auth Form
```bash
touch components/auth-form.tsx
```
In `components/auth-form.tsx`:
```tsx
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
      router.push('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setError(null);
      router.push('/');
    } catch (err) {
      setError('Sign up failed. Try again with a valid email.');
    }
  };

  useEffect(() => {
    if (user) router.push('/');
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

```

## Create Sign In Page
```bash
mkdir app/sign-in && touch app/sign-in/page.tsx
```
In `app/sign-in/page.tsx`:
```tsx
import { Box } from '@mui/material'
import AuthForm from '@/components/auth-form'

export default function SignInPage() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 65px)",
        width: "100vw"
      }}
    >
      <AuthForm />
    </Box>
  );
}

```

## Add App Nav Links
In `components/app-nav.tsx`:
```tsx
'use client'

import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/providers/theme-provider'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import HomeIcon from '@mui/icons-material/Home'
import LightModeIcon from '@mui/icons-material/LightMode'
import SignInIcon from '@mui/icons-material/Login'
import SignOutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

export default function AppNav() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { toggleTheme, mode } = useTheme();
  const { user, isLoading, logout } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Next Boilerplate
        </Typography>

        <IconButton color="inherit" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={handleMenuClose}
            component={Link}
            href="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <ListItemIcon>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </MenuItem>

          <MenuItem onClick={toggleTheme}>
            <ListItemIcon>
              {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} />
          </MenuItem>

          {!isLoading && user ? (
            <MenuItem
              onClick={logout}
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <ListItemIcon>
                <SignOutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          ) : (
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              href="/sign-in"
              sx={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <ListItemIcon>
                <SignInIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
          )}
        </Menu>

      </Toolbar>
    </AppBar>
  );
}

```


</details>



<details>
<summary>Middleware</summary>

## Create Middleware
```bash
touch middleware.ts
```
In `middleware.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL('/sign-in', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*']
};

```

## Add Dashboard Page
```bash
mkdir app/dashboard && touch app/dashboard/page.tsx
```
In `app/dashboard/page.tsx`:
```tsx
export default function DashboardPage() {
  return (
    <div>Dashboard Page</div>
  );
}
```

## Update Auth Form
In `components/auth-form.tsx`:
```tsx
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

```


</details>


<details>
<summary>Supabase Clients</summary>

## Supabase Browser/Server/Admin Clients
Some data, such as listing all users, is not available through the Supabase browser SDK for security reasons, and requires the Supabase server SDK.  When using the server SDK, there is an optional use of the service role key, rather than anon key as part of escalating the request to admin level to bypass row level security (RLS).  

### Supabase Browser Client
In `supabase/browser-client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for next js browser/client.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

```

### Supabase Server Client
Create the file:
```bash
touch supabase/server-client.ts
```
In `supabase/server-client.ts`:
```ts
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

```

### Supabase Admin Client
Create the file:
```bash
touch supabase/admin-client.ts
```
In `supabase/admin-client.ts`:
```ts
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

```


</details>



<details>
<summary>Admin User Role Promotion</summary>

## API Routes Required
In order to setup admin roles, promotion, and onboarding the first admin, several routes are required:
- `GET` `/api/users` - List all users - Requires Supabase Service Role Key
- `POST` `/api/users/promote` - Promote a user to a new role.  When onboarding a new app deployment, the role requirement of admin to create another admin must be waived for the first admin created.
- `GET` `/api/roles/[role]/count` - Return a count of how many users with a provided role exist.

### Create List Users Route
```bash
mkdir -p app/api/users && touch app/api/users/route.ts
```
In `app/api/users/route.ts`:
```ts
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

```

### Create Promote User Route
```bash
mkdir -p app/api/users/promote && touch app/api/users/promote/route.ts
```
In `app/api/users/promote/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerAdminClient } from '@/supabase/admin-client'
import { AppUser, AppUserRole } from '@/lib/types';

/**
 * Promote a user to a new role.
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

```

### Create Role Count Route
```bash
mkdir -p app/api/roles/\[role\]/count && touch app/api/roles/\[role\]/count/route.ts
```
In `app/api/roles/[role]/count/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerAdminClient } from '@/supabase/admin-client'
import { AppUser, AppUserRole } from '@/lib/types';

/**
 * Get a count of how many users have the admin role.
 */
export async function GET(req: NextRequest, params: { role: AppUserRole } ) {
  try {
    // Parse request parameters
    const { role } = await params;

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

    // Determine count of users with role 
    const count = data.users.filter((user) => {
      const appUser = user as AppUser;
      return appUser.app_metadata.role === role;
    }).length;

    // Success
    return NextResponse.json({ count });

  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## Create First Run Component
Create the file:
```bash
touch components/first-run.tsx
```
In `components/first-run.tsx`:
```tsx
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

```

## Create Start Page
Create the file:
```bash
mkdir -p app/start && touch app/start/page.tsx
```
In `app/start/page.tsx`:
```tsx
import { Box } from '@mui/material'
import FirstRun from '@/components/first-run';

export default function StartPage() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 65px)",
        width: "100vw"
      }}
    >
      <FirstRun />
    </Box>
  );
}

```


</details>



<details>
<summary>Progressive Web App (PWA)</summary>

## Create Manifest
Create file:
```bash
touch app/manifest.ts
```
In `app/manifest.ts`:
```ts
import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next Boilerplate',
    short_name: 'Next Boilerplate',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

## Copy Public Files
Copy the icons files in the repo `/public` directory into your projects `/public` directorty.  
To add your own icons, the next js documentation recommends using [RealFaviconGenerator](https://realfavicongenerator.net/).


</details>


