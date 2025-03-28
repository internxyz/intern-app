"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export default function WalletUnlock() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // desktop
  if (isDesktop) {
    return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <Button>
        <Lock />
        Unlock
      </Button>
    </div>
    )
  }

  // mobile
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <Button>
        <Lock />
        Unlock
      </Button>
    </div>
  )
}