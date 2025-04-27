"use client"

import { useMediaQuery } from "@/hooks/use-media-query";
import { Toaster } from "sonner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <>
        <main className="p-4">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </>
    );
  }

  return (
    <>
      <main className="p-4">
        {children}
      </main>
      <Toaster position="top-right" />
    </>
  );
} 