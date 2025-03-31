"use client"

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Button } from "@/components/ui/button";
import WalletLoading from '@/components/wallet-loading';
import WalletUnlock from "@/components/wallet-unlock";
import WalletOnboarding from "@/components/wallet-onboarding";
import { Lock } from "lucide-react";
import { truncateAddress } from '@/lib/utils';


export interface InternWalletState {
  isUnlocked: boolean;
  walletIds: string[];
  lastWalletId: string;
  currentAddress: string;
}

// Set the string key and the initial value
export const internWalletStateAtom = atomWithStorage<InternWalletState | undefined>('INTERN_WALLET_STATE', undefined)

export default function WalletHome() {
  const [internWalletState, setInternWalletState] = useAtom(internWalletStateAtom)
  const [isWalletLoading, setIsWalletLoading] = useState(true)

  useEffect(() => {
    // Wait for next tick to ensure localStorage is hydrated
    const timer = setTimeout(() => {
      setIsWalletLoading(false)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [])

  if (isWalletLoading) {
    return (
      <WalletLoading />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {
        !internWalletState ? (
          <WalletOnboarding />
        ) : internWalletState && internWalletState.walletIds.length > 0 && !internWalletState.isUnlocked 
        ? (
          <WalletUnlock />
        ) : internWalletState && internWalletState.isUnlocked 
          ? (
            <div className="flex flex-row justify-between items-center">
              <p>{truncateAddress(internWalletState.currentAddress)}</p>
              <Button 
                variant="secondary"
                size="icon"
                onClick={() => setInternWalletState({
                  ...internWalletState,
                  currentAddress: "",
                  isUnlocked: false,
                })}>
                <Lock />
              </Button>
            </div>
          ) : (
            <WalletUnlock />
          )
      }
    </div>
  )
}