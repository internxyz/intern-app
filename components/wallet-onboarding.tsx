"use client"

import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerNested,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Lock, WalletMinimal, X } from "lucide-react"

export default function WalletOnboarding() {
  const [openFirst, setOpenFirst] = useState(false)
  const [openSecond, setOpenSecond] = useState(false)
  const [openThird, setOpenThird] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  // desktop
  if (isDesktop) {
    return (
      <Dialog open={openFirst} onOpenChange={setOpenFirst}>
        <DialogTrigger asChild>
          <Button>
            <Lock />
            Create wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  // mobile
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex">
      <Drawer open={openFirst} onOpenChange={setOpenFirst}>
        <DrawerTrigger asChild>
          <Button 
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-3/4"
            size="lg"
          >
            <WalletMinimal />
            New wallet
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>
              <div className="flex flex-row items-center justify-between">
                <div className="text-xl">New wallet</div>
                <DrawerClose asChild>
                  <Button variant="secondary" size="icon">
                    <X />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerTitle>
            <DrawerDescription>
              <div className="h-[4px] w-full rounded-full bg-gray-200 mt-4" />
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 mt-2">
            <DrawerNested open={openSecond} onOpenChange={setOpenSecond}>
              <DrawerTrigger asChild>
                <Button variant="outline">
                  Create new
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[100vh]">
                <DrawerHeader>
                  <DrawerTitle>
                    <div className="flex flex-row items-center justify-between">
                      <div className="text-xl">Create new</div>
                      <DrawerClose asChild>
                        <Button variant="secondary" size="icon">
                          <X />
                        </Button>
                      </DrawerClose>
                    </div>
                  </DrawerTitle>
                  <DrawerDescription>
                    <div className="h-[4px] w-full rounded-full bg-gray-200 mt-4" />
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 px-4 mt-2">
                  <input 
                    type="text" 
                    placeholder="Type a name for your wallet" 
                    className="w-full text-xl outline-none"
                  />
                </div>
              </DrawerContent>
            </DrawerNested>
            <DrawerNested open={openThird} onOpenChange={setOpenThird}>
              <DrawerTrigger asChild>
                <Button variant="outline">
                  Add existing
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[100vh]">
                <DrawerHeader>
                  <DrawerTitle>
                    <div className="flex flex-row items-center justify-between">
                      <div className="text-xl">Add existing</div>
                      <DrawerClose asChild>
                        <Button variant="secondary" size="icon">
                          <X />
                        </Button>
                      </DrawerClose>
                    </div>
                  </DrawerTitle>
                  <DrawerDescription>
                    <div className="h-[4px] w-full rounded-full bg-gray-200 mt-4" />
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </DrawerNested>
          </div>
          <DrawerFooter className="pt-2">
            Learn more
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}