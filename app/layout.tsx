import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from "@/components/app-layout"
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Intern app',
  description: 'Your AI intern + crypto wallet',
  metadataBase: new URL('https://app.intern.xyz'),
  openGraph: {
    title: 'Intern app',
    description: 'Your AI intern + crypto wallet',
    url: 'https://app.intern.xyz',
    siteName: 'Intern app',
    images: [
      {
        url: '/intern-tbn.png',
        width: 1200,
        height: 630,
        alt: 'og-image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intern app',
    description: 'Your AI intern + crypto wallet',
    creator: '@internxyz_',
    images: ['/intern-tbn.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Intern" />
      </head>
      <Script
        defer
        src="https://analytics.zxstim.com/script.js"
        data-website-id="8de8a545-024e-4c76-bbca-172bdb0c2020"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AppLayout>
              {children}
            </AppLayout>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
