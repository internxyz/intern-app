import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import { internWalletStateAtom } from "@/components/wallet-home";
import WalletError from "@/components/wallet-error";


export default function WalletMain() {
  const [internWalletState, setInternWalletState] = useAtom(
    internWalletStateAtom
  );

  if (!internWalletState) {
    return <WalletError />;
  }

  return (
    <div className="flex flex-row justify-between items-center">
      <p>{truncateAddress(internWalletState.currentAddress)}</p>
      <Button
        variant="secondary"
        size="icon"
        onClick={() =>
          setInternWalletState({
            ...internWalletState,
            currentAddress: "",
            isUnlocked: false,
          })
        }
      >
        <Lock />
      </Button>
    </div>
  );
}
