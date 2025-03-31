import { useAtom } from "jotai";
import { truncateAddress } from "@/lib/utils";
import { internWalletStateAtom } from "@/components/wallet-home";
import WalletError from "@/components/wallet-error";
import MobileNav from "@/components/mobile-nav";


export default function WalletMain() {
  const [internWalletState] = useAtom(
    internWalletStateAtom
  );

  if (!internWalletState) {
    return <WalletError />;
  }

  return (
    <div className="flex flex-col gap-4">
      <p>{truncateAddress(internWalletState.currentAddress)}</p>
      <MobileNav />
    </div>
  );
}
