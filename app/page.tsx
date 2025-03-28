import Header from "@/components/header";
import WalletHome from "@/components/wallet-home";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Header />
      <WalletHome />
    </div>
  );
}
