import { TriangleAlert } from 'lucide-react';

export default function WalletError() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <TriangleAlert className="h-10 w-10 text-red-500" />
    </div>
  )
}