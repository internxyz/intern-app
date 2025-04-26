import Image from "next/image";
import { Token } from "@/components/data/tokenlist";
import { useBalance } from "wagmi";
import { formatEther, Address } from "viem";
import { roundLongDecimalInBalance } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "./ui/skeleton";


interface TokenCardProps {
  token: Token;
  address: string | undefined;
}

interface TokenCardMiniProps {
  token: {
    address: string;
    name: string;
    symbol: string;
    image: string;
  };
  balance: bigint;
  isLoading: boolean;
}

function TokenCardCombined({ token, address }: TokenCardProps) {
  const balanceQueries = token.addresses.map((addr) => {
    const chainId = parseInt(addr.address.split(":")[1]);
    return { chainId, address: addr.address };
  });

  const balance1 = useBalance({
    address: address as Address,
    chainId: balanceQueries[0]?.chainId,
  });
  const balance2 = useBalance({
    address: address as Address,
    chainId: balanceQueries[1]?.chainId,
  });
  const balance3 = useBalance({
    address: address as Address,
    chainId: balanceQueries[2]?.chainId,
  });

  const balances = [
    { balance: balance1.data?.value || BigInt(0), isLoading: balance1.isLoading },
    { balance: balance2.data?.value || BigInt(0), isLoading: balance2.isLoading },
    { balance: balance3.data?.value || BigInt(0), isLoading: balance3.isLoading },
  ];

  const totalBalance = balances.reduce((sum, { balance }) => sum + balance, BigInt(0));
  const isLoading = balances.some(({ isLoading }) => isLoading);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <div className="bg-secondary rounded-full p-1">
                <Image src={token.image} alt={token.name} width={40} height={40} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold">{token.name}</h1>
                <div className="flex flex-row gap-2">
                  <div className="text-sm text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="w-[40px] h-[18px]" />
                    ) : (
                      roundLongDecimalInBalance(formatEther(totalBalance))
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 pl-4">
            {token.addresses.map((addr, index) => (
              <TokenCardMini 
                key={addr.address} 
                token={addr} 
                balance={balances[index].balance} 
                isLoading={balances[index].isLoading} 
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function TokenCardSingle({ token, address }: TokenCardProps) {
  const chainId = token.addresses[0].address.split(":")[1];
  const { data: balance } = useBalance({
    address: address as Address,
    chainId: parseInt(chainId),
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
            <p className="text-sm text-muted-foreground">
              {balance?.value
                ? roundLongDecimalInBalance(formatEther(balance.value))
                : "0"}
            </p>
            <p className="text-sm text-muted-foreground">{token.symbol}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenCardMini({ token, balance, isLoading }: TokenCardMiniProps) {

  if (balance === BigInt(0)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <div className="bg-secondary rounded-full p-1">
          <Image src={token.image} alt={token.name} width={40} height={40} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">{token.name}</h1>
          <div className="flex flex-row gap-2">
            {
              isLoading ? (
                <Skeleton className="w-[20px] h-[14px]" />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {roundLongDecimalInBalance(formatEther(balance))}
                </p>
              )
            }
            <p className="text-sm text-muted-foreground">{token.symbol}</p>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function TokenCard({ token, address }: TokenCardProps) {
  const crosschain = token.crosschain;
  return crosschain ? (
    <TokenCardCombined token={token} address={address} />
  ) : (
    <TokenCardSingle token={token} address={address} />
  );
}
