"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Scan } from "lucide-react";
import LockButton from "@/components/lock-button";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import WalletShortAddress from "@/components/wallet-short-address";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Header() {
  const [internWalletState] = useAtom(internWalletStateAtom);

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <header className="fixed top-4 left-4 w-full flex flex-row items-center justify-between border-b border-muted-foreground pb-4 pr-8">
        <div className="flex flex-row items-center gap-2 ml-60">
          <Link href="/wallets">
            <Avatar>
              <AvatarImage src="/logo.svg" />
              <AvatarFallback>
                <Image src="/logo.svg" alt="logo" width={24} height={24} />
              </AvatarFallback>
            </Avatar>
          </Link>
          {internWalletState && internWalletState.lastWalletId && internWalletState.isUnlocked && <WalletShortAddress internWalletState={internWalletState} />}
        </div>
        <div className="flex flex-row items-center gap-2">
          <Scan className="w-4 h-4" />
          <LockButton />
        </div>
      </header>
    )
  }

  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <Link href="/wallets">
          <Avatar>
            <AvatarImage src="/logo.svg" />
            <AvatarFallback>
              <Image src="/logo.svg" alt="logo" width={24} height={24} />
            </AvatarFallback>
          </Avatar>
        </Link>
        {internWalletState && internWalletState.lastWalletId && internWalletState.isUnlocked && <WalletShortAddress internWalletState={internWalletState} />}
      </div>
      <div className="flex flex-row items-center gap-2">
        <Scan className="w-4 h-4" />
        <LockButton />
      </div>
    </header>
  );
}
