"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Unlock,
  X,
  Eye,
  EyeOff,
  Check,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import { getOrThrow, decrypt } from "@/lib/sigpass";
// evm
import { mnemonicToAccount } from "viem/accounts";
// bip39
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { toast } from "sonner";
// form
import { AnyFieldApi, useForm } from "@tanstack/react-form";
// import drawer
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function WalletUnlock() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [internWalletState, setInternWalletState] = useAtom(
    internWalletStateAtom
  );
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // form for creating a new wallet with seed phrase and passkey
  const form = useForm({
    defaultValues: {
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      await getPasswordInternWallet(value.password);
    },
  });

  async function getPasskeyInternWallet() {
    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const lastWalletId = internWalletState?.lastWalletId;
    if (!lastWalletId) {
      toast.error("No wallet found");
      return;
    }
    const walletFormat = lastWalletId.split("/")[0];
    const handle = lastWalletId.split("/")[2];

    if (walletFormat === "pk") {
      // convert it to a Uint8Array
      const handleUint8Array = new Uint8Array(handle.split(",").map(Number));
      /**
       * Retrieve the seed phrase in bytes from authenticated storage
       */
      const bytes = await getOrThrow(handleUint8Array);
      if (!bytes) {
        toast.error("Failed to get wallet");
        return;
      }
      const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);

      if (mnemonicPhrase) {
        // derive the evm account from mnemonic
        const evmAccount = mnemonicToAccount(mnemonicPhrase, {
          accountIndex: 0,
          addressIndex: 0,
        });

        // compare the evm account address with the last wallet id address
        if (evmAccount.address === lastWalletId.split("/")[3]) {
          setInternWalletState({
            ...internWalletState,
            isUnlocked: Date.now(),
          });
        } else {
          toast.error("Mismatching wallet address");
          return;
        }
      } else {
        toast.error("Failed to get wallet");
        return;
      }
    }
  }

  async function getPasswordInternWallet(password: string) {
    const lastWalletId = internWalletState?.lastWalletId;
    if (!lastWalletId) {
      toast.error("No wallet found");
      return;
    }
    const walletFormat = lastWalletId.split("/")[0];
    const encryptedBytesString = lastWalletId.split("/")[2];

    if (walletFormat === "pw") {
      try {
        // Convert the comma-separated string back to a Uint8Array
        const encryptedBytes = new Uint8Array(encryptedBytesString.split(',').map(Number));
        const bytes = await decrypt(encryptedBytes.buffer, password);

        if (!bytes) {
          toast.error("Incorrect password");
          return;
        }

        const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);
        if (mnemonicPhrase) {
          // derive the evm account from mnemonic
          const evmAccount = mnemonicToAccount(mnemonicPhrase, {
            accountIndex: 0,
            addressIndex: 0,
          });

          if (evmAccount.address === lastWalletId.split("/")[3]) {
            setInternWalletState({
              ...internWalletState,
              isUnlocked: Date.now(),
            });
            toast.success("Wallet unlocked");
            setOpen(false); // Close the drawer after successful unlock
          } else {
            toast.error("Mismatching wallet address");
            return;
          }
        } else {
          toast.error("Failed to recover wallet");
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("Invalid password");
        return;
      }
    }
  }

  // desktop
  if (isDesktop) {
    return (
      <div className="flex fixed inset-0 bg-black/30 backdrop-blur-sm justify-center items-center">
        {
          internWalletState?.lastWalletId.split("/")[0] === "pk" ? (
            <Button onClick={getPasskeyInternWallet} size="lg">
              <Unlock />
              Unlock
            </Button>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Unlock />
                  Unlock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Seed phrase and Password</DialogTitle>
                  <DialogDescription>Unlock your wallet</DialogDescription>
                </DialogHeader>
                <div className="h-[2px] w-full rounded-full bg-muted mt-4" />
                <div className="flex flex-col gap-4 pb-6 mt-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                  >
                    <div>
                      <form.Field
                        name="password"
                        validators={{
                          onChange: ({ value }) =>
                            !value
                              ? "...waiting for a password"
                              : value.length < 6
                              ? "Password must be at least 6 characters"
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
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  placeholder="Enter a password"
                                  className="w-full text-2xl outline-none"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {field.state.value &&
                                    (showPassword ? (
                                      <Eye className="h-4 w-4" />
                                    ) : (
                                      <EyeOff className="h-4 w-4" />
                                    ))}
                                </Button>
                              </div>
                              <FieldInfo field={field} />
                            </div>
                          );
                        }}
                      </form.Field>
                      <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                      >
                        {([canSubmit, isSubmitting]) => (
                          <div className="flex flex-row gap-2 mt-4 justify-end">
                            <Button
                              size="icon"
                              variant="secondary"
                              type="reset"
                              onClick={() => form.reset()}
                            >
                              <RotateCcw />
                            </Button>
                            <Button size="lg" type="submit" disabled={!canSubmit}>
                              {isSubmitting ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <>
                                  <Unlock />
                                  Unlock
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </form.Subscribe>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          )
        }
      </div>
    );
  }

  // mobile
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      {internWalletState?.lastWalletId.split("/")[0] === "pk" ? (
        <Button
          className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] mx-auto"
          onClick={getPasskeyInternWallet}
          size="lg"
        >
          <Unlock />
          Unlock
        </Button>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] mx-auto"
              size="lg"
            >
              <Unlock />
              Unlock
            </Button>
          </DrawerTrigger>
          <DrawerContent>
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
              <DrawerDescription>Unlock your wallet</DrawerDescription>
            </DrawerHeader>
            <div className="h-[2px] w-full rounded-full bg-muted mt-4" />
            <div className="flex flex-col gap-4 px-4 pb-6 mt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div>
                  <form.Field
                    name="password"
                    validators={{
                      onChange: ({ value }) =>
                        !value
                          ? "...waiting for a password"
                          : value.length < 6
                          ? "Password must be at least 6 characters"
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
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Enter a password"
                              className="w-full text-2xl outline-none"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {field.state.value &&
                                (showPassword ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                ))}
                            </Button>
                          </div>
                          <FieldInfo field={field} />
                        </div>
                      );
                    }}
                  </form.Field>
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <div className="flex flex-row gap-2 mt-4 justify-end">
                        <Button
                          size="icon"
                          variant="secondary"
                          type="reset"
                          onClick={() => form.reset()}
                        >
                          <RotateCcw />
                        </Button>
                        <Button size="lg" type="submit" disabled={!canSubmit}>
                          {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <>
                              <Unlock />
                              Unlock
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </form.Subscribe>
                </div>
              </form>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div className="text-sm">
      {field.state.meta.isValidating ? (
        "Checking..."
      ) : field.state.meta.isTouched ? (
        field.state.meta.errors.length ? (
          <em>{field.state.meta.errors.join(",")}</em>
        ) : (
          <div className="text-green-600 flex flex-row gap-2 items-center">
            <Check className="w-5 h-5" />
            perfect
          </div>
        )
      ) : null}
    </div>
  );
}
