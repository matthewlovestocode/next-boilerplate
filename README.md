# Next JS Boilerplate
This serves as a next js app starter, and the following is a walkthrough of it's creation.

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

## Checkpoint
At this point you should have a basic Next JS app skeleton setup with MUI + Next SSR Integration, and the CSS Baseline moved from next globals to MUI.  You also have a light and dark theme, with the capacity to toggle themes.

## Components
Adding some basic components for navigation.

### App Nav
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

## Checkpoint
There is now a top app navigation with a dropdown menu, containing the ability to toggle light or dark theme.

