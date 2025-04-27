"use client"
import Header from "@/components/header";
import WalletHome from "@/components/wallet-home";
import { useMediaQuery } from "@/hooks/use-media-query";


export default function Home() {

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <div className="flex flex-col">
        <Header />
        <WalletHome />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header />
      <WalletHome />
    </div>
  );
}
