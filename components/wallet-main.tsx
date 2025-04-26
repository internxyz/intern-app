import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import WalletError from "@/components/wallet-error";
import { useMediaQuery } from "@/hooks/use-media-query"
import TokenPortfolio from "@/components/token-portfolio";


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
      <div className="grid grid-cols-3 gap-4">
        <TokenPortfolio />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <TokenPortfolio />
    </div>
  );
}
