import { Token } from "@/components/data/tokenlist";

export function tokenListProcessor(tokenList: Token[]) {
  // combine tokens with the same address (even if they have different eip155 chains)
  const combinedTokenList = tokenList.reduce<Token[]>((acc, token) => {
    const existingToken = acc.find((t) => t.address === token.address);
    if (existingToken) {
      return acc;
    }
    return [...acc, token];
  }, []);
  return combinedTokenList;
}
