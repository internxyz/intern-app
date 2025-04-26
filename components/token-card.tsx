import Image from "next/image";
import { Token } from "@/components/data/tokenlist";
import { useBalance } from "wagmi";
import { formatEther, Address } from "viem";

export default function TokenCard({ token }: { token: Token }) {
  const { data: balance } = useBalance({
    address: token.address as Address,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <div className="bg-secondary rounded-full p-1">
          <Image src={token.image} alt={token.name} width={40} height={40} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">{token.name}</h1>
          <div className="flex flex-row gap-2">
            <p className="text-sm text-muted-foreground">{balance?.value ? formatEther(balance.value) : "0"}</p>
            <p className="text-sm text-muted-foreground">{token.symbol}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
