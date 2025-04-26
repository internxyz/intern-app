export const tokenList: Token[] = [
  {
    id: "eth",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    image: "/logos/eth.svg",
    crosschain: true,
    addresses: [
      {
        address: "eip155:11155111/native:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        name: "Ethereum Sepolia",
        symbol: "ETH",
        decimals: 18,
        image: "/logos/eth.svg",
      },
      {
        address: "eip155:84532/native:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        name: "Base Sepolia",
        symbol: "ETH",
        decimals: 18,
        image: "/logos/base.svg",
      },
      {
        address: "eip155:421614/native:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        name: "Arbitrum Sepolia",
        symbol: "ETH",
        decimals: 18,
        image: "/logos/arb.svg",
      }
    ]
  }
]

export interface Token {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  image: string;
  crosschain: boolean;
  addresses: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
  }[];
}