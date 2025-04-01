import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { internWalletStateAtom } from "@/components/wallet-home";
import { useAtom } from "jotai";

export default function LockButton() {
  const [internWalletState, setInternWalletState] = useAtom(internWalletStateAtom)

  if (!internWalletState) return null;

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() =>
        setInternWalletState({
          ...internWalletState,
          isUnlocked: 0,
          walletIds: internWalletState.walletIds,
          lastWalletId: internWalletState.lastWalletId,
        })
      }
    >
      <Lock />
    </Button>
  );
}
