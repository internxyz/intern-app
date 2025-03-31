"use client";

import Image from "next/image";
import { Cuer } from "cuer";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home"
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExportWallet() {
  const [internWalletState] = useAtom(internWalletStateAtom)

  const internWalletStateToBeExported = {
    ...internWalletState,
    currentAddress: "",
    isUnlocked: false,
  }

  if (!internWalletState) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-[100vh]">
        <Image src="/logo.svg" alt="logo" width={100} height={100} />
        <div className="text-xl font-bold">
          Please create or import a wallet first
        </div>
        <div className="flex flex-row gap-2">
          <Button asChild>
            <Link href="/">
              Create
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/import">
              Import
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <div className="dark:bg-white rounded-lg p-4">
        <Cuer
          arena="/logo.svg"
          value={JSON.stringify(internWalletStateToBeExported)}
          size="100%"
          color="black"
        />
      </div>
    </div>
  )
}