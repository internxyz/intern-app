"use client"

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import WalletLoading from '@/components/wallet-loading';
import WalletUnlock from "@/components/wallet-unlock";
import WalletOnboarding from "@/components/wallet-onboarding";
import WalletMain from "@/components/wallet-main";

export interface InternWalletState {
  isUnlocked: number; // Unix timestamp when wallet was last unlocked, 0 means locked
  walletIds: string[];
  lastWalletId: string;
}

// Set the string key and the initial value
export const internWalletStateAtom = atomWithStorage<InternWalletState | undefined>('INTERN_WALLET_STATE', undefined)

export default function WalletHome() {
  const [internWalletState] = useAtom(internWalletStateAtom)
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
            <WalletMain />
          ) : (
            <WalletUnlock />
          )
      }
    </div>
  )
}