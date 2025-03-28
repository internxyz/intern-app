"use client"


import { useAtom } from 'jotai';
import { atomWithStorage, RESET } from 'jotai/utils';
import { Button } from "@/components/ui/button";
import WalletUnlock from "@/components/wallet-unlock";
import WalletOnboarding from "@/components/wallet-onboarding";

export interface INTERN_WALLET_STATES {
  IS_UNLOCKED: boolean;
  WALLET_IDS: string[];
}

// Set the string key and the initial value
export const internWalletStateAtom = atomWithStorage<INTERN_WALLET_STATES | undefined>('INTERN_WALLET_STATE', undefined)

export default function WalletHome() {
  const [internWalletState, setInternWalletState] = useAtom(internWalletStateAtom)

  return (
    <div className="flex flex-col gap-8">
      {
        internWalletState && internWalletState.WALLET_IDS.length > 0 ? (
          <>
            <div className="flex flex-col gap-2">
              {
                internWalletState.WALLET_IDS.map((walletId) => (
                <div key={walletId}>{walletId}</div>
              ))
            }
          </div>
          <WalletUnlock />
          </>
        ) : (
          <WalletOnboarding />
        )
      }
      <Button onClick={() => setInternWalletState(RESET)}>
        Clear
      </Button>
    </div>
  )
}