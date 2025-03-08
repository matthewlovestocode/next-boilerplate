# Next JS Boilerplate
This serves as a next js app starter, and the following is a walkthrough of it's creation.

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

const cookieStore = await cookies();

/**
 * Supabase server client.
 */
export const supabase = await createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  }
);
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

const cookieStore = await cookies();

/**
 * Supabase client for next js server that bypasses supabase RLS for admin override.
 * Do not expose to next js client code.
 */
export const supabase = await createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  }
);
```


</details>



<details>
<summary>Admin User Role Promotion</summary>

## Create Basic User Routes

## Create Promote User Button Component 


</details>

