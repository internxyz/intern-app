"use client"

import { useState, useEffect } from "react"
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
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer"
import Link from "next/link";
import { Lock, WalletMinimal, X, BadgePlus, Import, RotateCcw, Loader2, Check, KeyRound, MonitorSmartphone, Eye, EyeOff } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import { createOrThrow, encrypt, checkBrowserWebAuthnSupport } from "@/lib/sigpass";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { mnemonicToAccount } from 'viem/accounts'
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

export default function WalletOnboarding() {
  const [openFirst, setOpenFirst] = useState(false)
  const [openSecond, setOpenSecond] = useState(false)
  const [openThird, setOpenThird] = useState(false)
  const [openFourth, setOpenFourth] = useState(false)
  const [openSixth, setOpenSixth] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [internWalletState, setInternWalletState] = useAtom(internWalletStateAtom)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [webAuthnSupportedStatus, setWebAuthnSupportedStatus] = useState<"loading" | "supported" | "unsupported">("loading")

  // check if browser supports WebAuthn
  useEffect(() => {
    setWebAuthnSupportedStatus(checkBrowserWebAuthnSupport() ? "supported" : "unsupported")
  }, [])

  // form for creating a new wallet with seed phrase and passkey
  const form = useForm({
    defaultValues: {
      walletName: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      await createInternWallet(value.walletName)
    },
  })

  // form for creating a new wallet with seed phrase and password
  const form2 = useForm({
    defaultValues: {
      walletName: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  // create Intern Wallet with seed phrase and passkey
  async function createInternWallet(name: string) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    /**
     * Store the seed phrase into authenticated storage
     */
    const handle = await createOrThrow(name, bytes);
    /**
     * Store the handle to the seed phrase into some unauthenticated storage
     */
    if (!handle) {
      toast.error("Failed to create wallet")
      return
    }

    const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);

    if (mnemonicPhrase && internWalletState?.walletIds.length === 0) {

      // derive the evm account from mnemonic
      const evmAccount = mnemonicToAccount(mnemonicPhrase,
        {
          accountIndex: 0,
          addressIndex: 0,
        }
      );

      const newWalletId = `pk/${name}/${handle.toString()}/${evmAccount.address}`
      setInternWalletState({
        walletIds: [newWalletId],
        lastWalletId: newWalletId,
        isUnlocked: false,
      })
      toast.success("Wallet created")
    } else {

      // derive the evm account from mnemonic
      const evmAccount = mnemonicToAccount(mnemonicPhrase,
        {
          accountIndex: 0,
          addressIndex: 0,
        }
      );
      
      const newWalletId = `pk/${name}/${handle.toString()}/${evmAccount.address}`
      setInternWalletState({
        walletIds: [...(internWalletState?.walletIds || []), newWalletId],
        lastWalletId: newWalletId,
        isUnlocked: false,
      })
      toast.success("Wallet created")
    }
  }

  // create Intern Wallet with seed phrase and password
  async function createInternWalletWithPassword(name: string, password: string) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);
    if (!mnemonicPhrase) {
      toast.error("Failed to create wallet")
      return
    }

    if (mnemonicPhrase) {
      const evmAccount = mnemonicToAccount(mnemonicPhrase,
        {
          accountIndex: 0,
          addressIndex: 0,
        }
      );

      const encryptedBytes = await encrypt(bytes, password);
      if (!encryptedBytes) {
        toast.error("Failed to encrypt wallet")
        return
      }

      const newWalletId = `pw/${name}/${encryptedBytes.toString()}/${evmAccount.address}`
      setInternWalletState({
        walletIds: [...(internWalletState?.walletIds || []), newWalletId],
        lastWalletId: newWalletId,
        isUnlocked: false,
      })
      toast.success("Wallet created")
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
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] mx-auto"
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
            <div className="h-[2px] w-full rounded-full bg-muted mt-4" />
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 pb-6 mt-2">
            <DrawerNested open={openSecond} onOpenChange={setOpenSecond}>
              <DrawerTrigger asChild>
                <Button className="flex flex-row gap-4 h-fit text-left justify-start items-start" variant="secondary">
                  <BadgePlus className="mt-1" />
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium">Create new</div>
                    <div className="text-xs text-muted-foreground whitespace-normal">Create a fresh wallet with no previous history</div>
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
                  <DrawerDescription>
                    Fresh wallet with no previous history
                  </DrawerDescription>
                  <div className="h-[2px] w-full rounded-full bg-muted mt-4" />
                </DrawerHeader>
                <div className="flex flex-col gap-4 px-4 pb-6 mt-2">
                  <DrawerNested open={openThird} onOpenChange={setOpenThird}>
                    <DrawerTrigger asChild disabled={webAuthnSupportedStatus === "unsupported"}>
                      <Button className="flex flex-row gap-4 h-20 text-left justify-start items-start pt-4" variant="secondary">
                        <BadgePlus className="mt-1" />
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium">Seed phrase and Passkey {webAuthnSupportedStatus === "supported" && <Badge className="ml-2 text-xs dark:bg-green-400 bg-green-600">Recommended</Badge>}</div>
                          <div className="text-xs text-muted-foreground whitespace-normal mt-2">Using device passkey to secure your seedphrase</div>
                        </div>
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[300px]">
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
                          Using device passkey to secure your seedphrase
                        </DrawerDescription>
                        <div className="h-[2px] w-full rounded-full bg-muted mt-4" />
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
                                      : // check if the wallet name is already taken
                                        internWalletState?.walletIds.some(id => id.split('/')[0] === value)
                                          ? 'Wallet name already exists'
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
                  <DrawerNested open={openSixth} onOpenChange={setOpenSixth}>
                    <DrawerTrigger asChild>
                      <Button className="flex flex-row gap-4 h-20 text-left justify-start items-start pt-4" variant="secondary">
                        <BadgePlus className="mt-1" />
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium">Seed phrase and Password</div>
                          <div className="text-xs text-muted-foreground whitespace-normal mt-2">Create a wallet with a seed phrase and password</div>
                        </div>
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[400px]">
                      <DrawerHeader>
                        <DrawerTitle>
                          <div className="flex flex-row items-center justify-between">
                            <div className="text-xl">Seed phrase and Password</div> 
                            <DrawerClose asChild>
                              <Button variant="secondary" size="icon">
                                <X />
                              </Button>
                            </DrawerClose>
                          </div>
                        </DrawerTitle>
                        <DrawerDescription>
                          Create a wallet with a seed phrase and password
                        </DrawerDescription>
                        <div className="h-[2px] w-full rounded-full bg-muted mt-4" />
                      </DrawerHeader>
                      <div className="flex flex-col gap-4 px-4 pb-6 mt-2">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form2.handleSubmit()
                          }}
                        >
                          <div>
                            {/* A type-safe field component*/}
                            <form2.Field
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
                                  <FieldInfo2 field={field} />
                                </div>
                              )}
                            </form2.Field>

                            <form2.Field
                              name="password"
                              validators={{
                                onChange: ({ value }) =>
                                  !value
                                    ? '...waiting for a password'
                                    : value.length < 6
                                      ? 'Password must be at least 6 characters'
                                      : undefined,
                              }}
                            >
                              {(field) => {
                                return (
                                  <div className="flex flex-col gap-1 h-16 mt-4">
                                    <div className="flex flex-row items-center gap-2">
                                      <input
                                        type={showPassword ? "text" : "password"}
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Enter a password"
                                        className="w-full text-2xl outline-none"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                      >
                                        {field.state.value && (
                                          showPassword ? (
                                            <Eye className="h-4 w-4" />
                                          ) : (
                                            <EyeOff className="h-4 w-4" />
                                          )
                                        )}
                                      </Button>
                                    </div>
                                    <FieldInfo2 field={field} />
                                  </div>
                                );
                              }}
                            </form2.Field>
                          </div>
                          <form2.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                          >
                            {([canSubmit, isSubmitting]) => (
                              <div className="flex flex-row gap-2 mt-4 justify-end">
                                <Button size="icon" variant="secondary" type="reset" onClick={() => form2.reset()}>
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
                          </form2.Subscribe>
                        </form>
                      </div>
                    </DrawerContent>
                  </DrawerNested>
                </div>
              </DrawerContent>
            </DrawerNested>
            <DrawerNested open={openFourth} onOpenChange={setOpenFourth}>
              <DrawerTrigger asChild>
                <Button className="flex flex-row gap-4 h-fit text-left justify-start items-start" variant="secondary">
                  <Import className="mt-1" />
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium">Add existing</div>
                    <div className="text-xs text-muted-foreground whitespace-normal">Add an existing wallet by importing or restoring</div>
                  </div>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-fit">
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
                    Add an existing wallet by importing or restoring
                  </DrawerDescription>
                  <div className="h-[2px] w-full rounded-full bg-muted mt-4" />
                </DrawerHeader>
                <div className="flex flex-col gap-4 px-4 pb-6 mt-2">
                  <Button asChild className="flex flex-row gap-4 h-20 text-left justify-start items-start" variant="secondary">
                    <Link href="/import-key">
                      <KeyRound className="mt-1" />
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium">Seed phrase or Private key</div>
                        <div className="text-xs text-muted-foreground whitespace-normal">Import a wallet using its exported seed phrase or private key</div>
                      </div>
                    </Link>
                  </Button>
                  <Button asChild className="flex flex-row gap-4 h-20 text-left justify-start items-start" variant="secondary">
                    <Link href="/import-from-another-device">
                      <MonitorSmartphone className="mt-1" />
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium">From another device</div>
                        <div className="text-xs text-muted-foreground whitespace-normal">Import a wallet from another device with Intern Wallet using QR code</div>
                      </div>
                    </Link>
                  </Button>
                </div>
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

function FieldInfo2({ field }: { field: AnyFieldApi }) {
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

