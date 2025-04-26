import { tokenList } from "@/components/data/tokenlist";
import { useMediaQuery } from "@/hooks/use-media-query";
import TokenCard from "@/components/token-card";

export default function TokenPortfolio() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        {tokenList.map((token) => (
          <TokenCard key={token.address} token={token} />
        ))}
      </div>
    )
  }
  
  
}