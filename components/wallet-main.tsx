import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import { internWalletStateAtom } from "@/components/wallet-home";
import WalletError from "@/components/wallet-error";
import MobileNav from "@/components/mobile-nav";


export default function WalletMain() {
  const [internWalletState, setInternWalletState] = useAtom(
    internWalletStateAtom
  );

  if (!internWalletState) {
    return <WalletError />;
  }

  return (
    <div className="flex flex-col gap-4">
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
      <MobileNav />
    </div>
  );
}
