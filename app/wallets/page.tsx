"use client";

import Link from "next/link";
import { Settings, BadgeInfo, Plus, Ellipsis } from "lucide-react";
import { internWalletStateAtom } from "@/components/wallet-home";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function Wallets() {
  const [internWalletState, setInternWalletState] = useAtom(internWalletStateAtom);
  const router = useRouter();

  function handleSwitchWallet(walletId: string) {
    setInternWalletState({
      lastWalletId: walletId,
      isUnlocked: 0,
      walletIds: internWalletState?.walletIds || [],
    });
    router.push(`/`);
  }

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
        <div className="flex flex-row items-center gap-4">
          <Ellipsis className="w-4 h-4" />
          <Link href="/onboarding">
            <Plus className="w-4 h-4" />
          </Link>
        </div>
      </div>
      {internWalletState && internWalletState.walletIds.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {internWalletState.walletIds.map((walletId) => {
            const isCurrentWallet = walletId === internWalletState.lastWalletId;
            
            return isCurrentWallet ? (
              <div key={walletId.split("/")[3]} className="relative">
                <Link
                  href={`/`}
                  className="flex flex-col gap-2 bg-secondary h-[80px] rounded-md px-4 py-2 ring-2 ring-offset-4 ring-primary ring-offset-background dark:ring-offset-background"
                >
                  <div className="font-semibold">
                    {walletId.split("/")[1]}
                  </div>
                </Link>
                <Ellipsis className="w-4 h-4 absolute top-3 right-3" />
              </div>
            ) : (
              <div
                key={walletId.split("/")[3]}
                className="flex flex-col gap-2 bg-secondary h-[80px] rounded-md px-4 py-2"
                onClick={() => handleSwitchWallet(walletId)}
              >
                <div className="font-semibold">
                  {walletId.split("/")[1]}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}