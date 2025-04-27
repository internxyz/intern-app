"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { House, Repeat, Blocks, List } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";


export default function MobileNav() {
  // get the pathname
  const pathname = usePathname();

  // check if the screen is desktop
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // check if the path is active
  function isActivePath(path: string) {
    if (path === pathname) {
      return "text-primary";
    } else {
      return "text-muted-foreground";
    }
  }

  return (
    <div className={`grid grid-cols-4 justify-items-center fixed bottom-0 left-0 w-full h-[80px] bg-background border-t-2 border-muted pt-2 ${isDesktop ? "hidden" : ""}`}>
      <Link
        className={`flex flex-col justify-start ${isActivePath(
          "/"
        )} rounded-none h-full p-4`}
        href="/"
      >
        <House className="w-6 h-6" />
      </Link>
      <Link
        className={`flex flex-col justify-start ${isActivePath(
          "/swap"
        )} rounded-none h-full p-4`}
        href="/swap"
      >
        <Repeat className="w-6 h-6" />
      </Link>
      <Link
        className={`flex flex-col justify-start ${isActivePath(
          "/activities"
        )} rounded-none h-full p-4`}
        href="/activities"
      >
        <List className="w-6 h-6" />
      </Link>
      <Link
        className={`flex flex-col justify-start ${isActivePath(
          "/explore"
        )} rounded-none h-full p-4`}
        href="/explore"
      >
        <Blocks className="w-6 h-6" />
      </Link>
    </div>
  );
}