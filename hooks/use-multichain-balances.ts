import { Token } from "@/components/data/tokenlist";
import { Address } from "viem";
import { useBalance } from "wagmi";

export default function useMultichainBalances(token: Token, address: Address) {
  const chainIds = token.addresses.map((addr) => parseInt(addr.address.split(":")[1]));
  const balances = chainIds.map((chainId) => ChainBalance(address, chainId));

  // add all the balances together
  const totalBalance = balances.reduce((acc, balance) => acc + (balance.data?.value || BigInt(0)), BigInt(0));

  return { balances, totalBalance, isLoading: balances.some((balance) => balance.isLoading) };
}

function ChainBalance(address: Address, chainId: number) {
  const { data, isLoading } = useBalance({
    address,
    chainId,
  });
  return { data, isLoading };
}

