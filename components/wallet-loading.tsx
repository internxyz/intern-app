import { Hourglass } from 'lucide-react';

export default function WalletLoading() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex">
      <Hourglass className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  )
}