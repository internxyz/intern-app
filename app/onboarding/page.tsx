"use client";

import WalletOnboarding from "@/components/wallet-onboarding";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleCheck } from "lucide-react";

export default function OnboardingPage() {
  const [internWalletState] = useAtom(internWalletStateAtom);
  const [initialWalletCount, setInitialWalletCount] = useState<number>(0);
  const currentWalletCount = internWalletState?.walletIds.length || 0;

  useEffect(() => {
    // Store initial wallet count when component mounts
    setInitialWalletCount(internWalletState?.walletIds.length || 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasNewWallet = currentWalletCount > initialWalletCount;

  return (
    <div>
      {internWalletState && !hasNewWallet ? (
        <WalletOnboarding />
      ) : hasNewWallet ? (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <CircleCheck className="w-12 h-12" />
            <div className="text-lg">
              Wallet created successfully!
            </div>
          </div>
          <Button
            asChild
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] mx-auto"
            size="lg"
          >
            <Link href="/">
              <ArrowRight />
              Go to home to unlock
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
