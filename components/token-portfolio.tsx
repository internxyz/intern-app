import { tokenList } from "@/components/data/tokenlist";
import { useMediaQuery } from "@/hooks/use-media-query";
import TokenCard from "@/components/token-card";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";

export default function TokenPortfolio() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [internWalletState] = useAtom(internWalletStateAtom);

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold mt-2">$ -</h1>
        {tokenList.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            address={
              internWalletState?.lastWalletId
                .split("/")[3]
                .split(":")[1]
                .split("+")[0]
            }
          />
        ))}
      </div>
    );
  }
}
