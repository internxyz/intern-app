export const tokenList: Token[] = [
  {
    address: "eip155:11155111/native:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    image: "/logos/eth.svg",
  },
  {
    address: "eip155:84532/native:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    image: "/logos/eth.svg",
  },
  {
    address: "eip155:421614/native:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    image: "/logos/eth.svg",
  }
]

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  image: string;
}