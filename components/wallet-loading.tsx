export default function WalletLoading() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-muted-foreground border-t-transparent rounded-full animate-spin" />
    </div>
  )
}