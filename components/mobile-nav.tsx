"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { House, Repeat, Blocks, List } from "lucide-react";


export default function MobileNav() {
  const pathname = usePathname();

  function isActivePath(path: string) {
    if (path === pathname) {
      return "text-primary";
    } else {
      return "text-muted-foreground";
    }
  }

  return (
    <div className="grid grid-cols-4 fixed bottom-0 left-0 w-full h-[80px] bg-background border-t-2 border-muted pt-2">
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/"
        )} rounded-none h-full`}
        variant="ghost"
        asChild
      >
        <Link href="/">
          <House className="w-6 h-6" />
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/swap"
        )} rounded-none h-full`}
        variant="ghost"
        asChild
      >
        <Link href="/swap">
          <Repeat className="w-6 h-6" />
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/activities"
        )} rounded-none h-full`}
        variant="ghost"
        asChild
      >
        <Link href="/activities">
          <List className="w-6 h-6" />
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/explore"
        )} rounded-none h-full`}
        variant="ghost"
        asChild
      >
        <Link href="/explore">
          <Blocks className="w-6 h-6" />
        </Link>
      </Button>
    </div>
  );
}