import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-muted-foreground border-t-transparent rounded-full animate-spin" />
      <Skeleton className="h-10 fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] mx-auto" />
    </div>
  )
}