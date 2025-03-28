"use client";

// wagmi
import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// tanstack query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// jotai
import { Provider as JotaiProvider } from 'jotai';

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
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


