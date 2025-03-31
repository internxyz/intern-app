"use client"

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import { getOrThrow } from "@/lib/sigpass";
// evm
import { mnemonicToAccount } from 'viem/accounts'
// bip39
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { toast } from "sonner";

export default function WalletUnlock() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [internWalletState, setInternWalletState] = useAtom(internWalletStateAtom)

  async function getInternWallet() {
    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const lastWalletId = internWalletState?.lastWalletId
    if (!lastWalletId) {
      toast.error("No wallet found")
      return
    }
    const handle = lastWalletId.split("/")[1]

    // i have an Uint8Array like this 17,149,74,43,1,59,153,34,52,96,21,31,63,164,118,159,31,231,81,101 but in string format
    // convert it to a Uint8Array
    const handleUint8Array = new Uint8Array(handle.split(",").map(Number));
    /**
     * Retrieve the private key from authenticated storage
     */
    const bytes = await getOrThrow(handleUint8Array);
    if (!bytes) {
      toast.error("Failed to get wallet")
      return
    }
    const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);
    // const privateKey = fromBytes(bytes, "hex");
    if (mnemonicPhrase) {
      // const account = privateKeyToAccount(privateKey as Address);
      // derive the evm account from mnemonic
      const evmAccount = mnemonicToAccount(mnemonicPhrase,
        {
          accountIndex: 0,
          addressIndex: 0,
        }
      );
      setInternWalletState({
        ...internWalletState,
        currentAddress: evmAccount.address,
        isUnlocked: true,
      })
    } else {
      toast.error("Failed to get wallet")
      return
    }
  }

  // desktop
  if (isDesktop) {
    return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex">
      <Button
      >
        <Unlock />
        Unlock
      </Button>
    </div>
    )
  }

  // mobile
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <Button 
        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] mx-auto"
        onClick={getInternWallet}
        size="lg"
      >
        <Unlock />
        Unlock
      </Button>
    </div>
  )
}