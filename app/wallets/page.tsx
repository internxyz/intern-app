"use client";

import Link from "next/link";
import { Settings, BadgeInfo, Plus } from "lucide-react";
import { internWalletStateAtom } from "@/components/wallet-home";
import { useAtom } from "jotai";

export default function Wallets() {
  const [internWalletState] = useAtom(internWalletStateAtom);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Link href="/settings">
          <Settings className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Wallets</h1>
        <BadgeInfo className="w-6 h-6" />
      </div>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">Your wallets</h2>
        <Plus className="w-4 h-4" />
      </div>

      {internWalletState && internWalletState.walletIds.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {internWalletState.walletIds.map((walletId) => (
            <div
              key={walletId.split("/")[0]}
              className="flex flex-col gap-2 bg-secondary h-[80px] rounded-md px-4 py-2 border border-muted-foreground"
            >
              <div className="font-semibold">
                {walletId.split("/")[0]}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}