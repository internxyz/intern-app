import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react"
import Header from "@/components/header";
import DesktopSidebar from "@/components/desktop-sidebar";
import MobileNav from "@/components/mobile-nav";


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
            <main className="flex flex-col min-h-screen p-4">
              <Header />
              <div className="flex flex-1">
                <DesktopSidebar />
                <div className="flex-1 pl-4 pt-4 md:pl-60 md:pt-14">
                  {children}
                </div>
              </div>
              <MobileNav />
            </main>
            <Toaster position="top-right" />
          </Providers>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
