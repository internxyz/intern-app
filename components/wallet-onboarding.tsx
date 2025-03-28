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
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Lock, WalletMinimal, X, BadgePlus, Import, RotateCcw, Loader2, Check } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import { createOrThrow } from "@/lib/sigpass";


export default function WalletOnboarding() {
  const [openFirst, setOpenFirst] = useState(false)
  const [openSecond, setOpenSecond] = useState(false)
  const [openThird, setOpenThird] = useState(false)
  const [internWalletState, setInternWalletState] = useAtom(internWalletStateAtom)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // form
  const form = useForm({
    defaultValues: {
      walletName: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  async function createInternWallet(name: string) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    /**
     * Store the private key into authenticated storage
     */
    const handle = await createOrThrow(name, bytes);
    /**
     * Store the handle to the private key into some unauthenticated storage
     */
    if (!handle) {
      return null;
    }

    if (internWalletState?.walletIds.length === 0) {
      const newWalletId = `${name}/${handle.toString()}`
      setInternWalletState({
        walletIds: [...(internWalletState?.walletIds || []), newWalletId],
        currentAddress: "",
        isUnlocked: false,
      })
    } else {
      const newWalletId = `${name}/${handle.toString()}`
      setInternWalletState({
        walletIds: [...(internWalletState?.walletIds || []), newWalletId],
        currentAddress: "",
        isUnlocked: false,
      })
    }
  }

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
            <div className="h-[4px] w-full rounded-full bg-gray-200 mt-4" />
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 pb-6 mt-2">
            <DrawerNested open={openSecond} onOpenChange={setOpenSecond}>
              <DrawerTrigger asChild>
                <Button className="flex flex-row gap-4 h-16 text-left justify-start items-start" variant="secondary">
                  <BadgePlus className="mt-1" />
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium">Create new</div>
                    <div className="text-xs text-muted-foreground">Create a fresh address with no previous history</div>
                  </div>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
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
                  <div className="h-[4px] w-full rounded-full bg-gray-200 mt-4" />
                </DrawerHeader>
                <div className="flex flex-col gap-4 px-4 pb-6 mt-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      form.handleSubmit()
                    }}
                  >
                    <div>
                      {/* A type-safe field component*/}
                      <form.Field
                        name="walletName"
                        validators={{
                          onChange: ({ value }) =>
                            !value
                              ? '...waiting for a name'
                              : value.length < 3
                                ? 'Wallet name must be at least 3 characters'
                                : undefined,
                          onChangeAsyncDebounceMs: 100,
                          onChangeAsync: async ({ value }) => {
                            return (
                              value.includes('error') && 'No "error" allowed in name'
                            )
                          },
                        }}
                      >
                        {(field) => (
                          <div className="flex flex-col gap-1 h-16">
                            <input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="Type a name for your wallet"
                              className="w-full text-2xl outline-none"
                            />
                            <FieldInfo field={field} />
                          </div>
                        )}
                      </form.Field>
                    </div>
                    <form.Subscribe
                      selector={(state) => [state.canSubmit, state.isSubmitting]}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <div className="flex flex-row gap-2 mt-4 justify-end">
                          <Button size="icon" variant="secondary" type="reset" onClick={() => form.reset()}>
                            <RotateCcw />
                          </Button>
                          <Button size="lg" type="submit" disabled={!canSubmit}>
                            {isSubmitting ? 
                              <Loader2 className="animate-spin" />
                              : 
                              <>
                                <BadgePlus />
                                Create
                              </>
                            }
                          </Button>
                        </div>
                      )}
                    </form.Subscribe>
                  </form>
                </div>
              </DrawerContent>
            </DrawerNested>
            <DrawerNested open={openThird} onOpenChange={setOpenThird}>
              <DrawerTrigger asChild>
                <Button className="flex flex-row gap-4 h-16 text-left justify-start items-start" variant="secondary">
                  <Import className="mt-1" />
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium">Add existing</div>
                    <div className="text-xs text-muted-foreground">Add an existing wallet by importing or restoring</div>
                  </div>
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
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div className="text-sm">
      {field.state.meta.isValidating ? (
        'Checking...'
      ) : field.state.meta.isTouched ? (
        field.state.meta.errors.length ? (
          <em>{field.state.meta.errors.join(',')}</em>
        ) : (
          <div className="text-green-600 flex flex-row gap-2 items-center"><Check className="w-5 h-5" />perfect</div>
        )
      ) : null}
    </div>
  )
}