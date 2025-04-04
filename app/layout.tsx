import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Intern',
  description: 'Your AI intern + crypto wallet',
  metadataBase: new URL('https://app.intern.xyz'),
  openGraph: {
    title: 'Intern',
    description: 'Your AI intern + crypto wallet',
    url: 'https://app.intern.xyz',
    siteName: 'Intern',
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
    title: 'Intern',
    description: 'Your AI intern + crypto wallet',
    creator: '@intern_uwu',
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
            <main className="p-4">
              {children}
            </main>
            <Toaster />
          </Providers>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
