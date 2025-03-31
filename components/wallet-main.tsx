import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import WalletError from "@/components/wallet-error";
import MobileNav from "@/components/mobile-nav";
import { useMediaQuery } from "@/hooks/use-media-query"


export default function WalletMain() {
  const [internWalletState] = useAtom(
    internWalletStateAtom
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!internWalletState) {
    return <WalletError />;
  }

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-4">
        None
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <MobileNav />
    </div>
  );
}
