"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Repeat, List, Blocks } from "lucide-react";
import { usePathname } from 'next/navigation'

export default function DesktopSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path
  return (
    <div className="fixed left-0 top-0 flex flex-col w-60 border-r border-muted-foreground h-screen bg-background">
      <div className="flex flex-row items-center justify-between p-4">
        <Image src="/logo.svg" alt="logo" width={24} height={24} />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Button asChild variant="ghost" className={`w-full justify-start gap-3 h-12 ${isActive("/") ? "bg-muted" : "text-muted-foreground"}`} size="lg">
          <Link href="/">
            <Home />
            Home
          </Link>
        </Button>
        <Button asChild variant="ghost" className={`w-full justify-start gap-3 h-12 ${isActive("/swap") ? "bg-muted" : "text-muted-foreground"}`} size="lg">
          <Link href="/swap">
            <Repeat />
            Swap
          </Link>
        </Button>
        <Button asChild variant="ghost" className={`w-full justify-start gap-3 h-12 ${isActive("/activities") ? "bg-muted" : "text-muted-foreground"}`} size="lg">
          <Link href="/activities">
            <List />
            Activities
          </Link>
        </Button>
        <Button asChild variant="ghost" className={`w-full justify-start gap-3 h-12 ${isActive("/explore") ? "bg-muted" : "text-muted-foreground"}`} size="lg">
          <Link href="/explore">
            <Blocks />
            Explore
          </Link>
        </Button>
      </div>
    </div>
  )
}