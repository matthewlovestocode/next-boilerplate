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
