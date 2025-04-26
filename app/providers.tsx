"use client";

// wagmi
import { http, createConfig, WagmiProvider } from 'wagmi'
import { sepolia, baseSepolia, arbitrumSepolia } from 'wagmi/chains'

// tanstack query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// jotai
import { Provider as JotaiProvider } from 'jotai';

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [sepolia, baseSepolia, arbitrumSepolia],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
  ssr: true,
})

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <JotaiProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </JotaiProvider>
  );
}


