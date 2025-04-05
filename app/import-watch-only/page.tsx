"use client";

import { useState } from "react";
import Link from "next/link";
import { Ellipsis, ArrowLeft } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, Import, Eye, EyeOff } from "lucide-react";
import { Check } from "lucide-react";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import { toast } from "sonner";
import { mnemonicToAccount } from 'viem/accounts'
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { createOrThrow, encrypt } from "@/lib/sigpass";


export default function ImportWatchOnlyPage() {
  const [internWalletState, setInternWalletState] = useAtom(
    internWalletStateAtom
  );
  const [walletPasswordEnabled, setWalletPasswordEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      walletName: "",
      walletAddress: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
      if (walletPasswordEnabled) {
        await createWatchOnlySignInCredentialWithPassword(value.walletName, value.password, value.walletAddress);
      } else {
        await createWatchOnlySignInCredentialWithPasskey(value.walletName, value.walletAddress);
      }
    },
  });

  // create Intern Wallet with seed phrase and passkey
  async function createWatchOnlySignInCredentialWithPasskey(name: string, address: string) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    /**
     * Store the seed phrase into authenticated storage
     */
    const handle = await createOrThrow("intern", bytes);
    /**
     * Store the handle to the seed phrase into some unauthenticated storage
     */
    if (!handle) {
      toast.error("Failed to import wallet")
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

      const newWalletId = `rpk/intern/${handle.toString()}/signin:${evmAccount.address}+${name}:${address}`
      setInternWalletState({
        walletIds: [newWalletId],
        lastWalletId: newWalletId,
        isUnlocked: 0,
      })
      toast.success("Wallet imported")
    } else if (mnemonicPhrase && internWalletState?.walletIds.length !== 0) {
      // check if there already a rpk wallet
      const rpkWallet = internWalletState?.walletIds.find(walletId => walletId.startsWith("rpk/"));

      if (rpkWallet) {
        
        const newWalletId = `${rpkWallet}+${name}:${address}`

        setInternWalletState({
          walletIds: internWalletState?.walletIds.map(id => id === rpkWallet ? newWalletId : id) || [],
          lastWalletId: newWalletId,
          isUnlocked: 0,
        })
        toast.success("Wallet imported")
      } else {
        const evmAccount = mnemonicToAccount(mnemonicPhrase,
          {
            accountIndex: 0,
            addressIndex: 0,
          }
        );

        const newWalletId = `rpk/intern/${handle.toString()}/signin:${evmAccount.address}+${name}:${address}`
        setInternWalletState({
          walletIds: internWalletState?.walletIds.map(id => id === rpkWallet ? newWalletId : id) || [],
          lastWalletId: newWalletId,
          isUnlocked: 0,
        })
        toast.success("Wallet imported")
      }
    } else {
      toast.error("Failed to import wallet")
      return
    }
  }

  // create Intern Wallet with seed phrase and password
  async function createWatchOnlySignInCredentialWithPassword(name: string, password: string, address: string) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);
    if (!mnemonicPhrase) {
      toast.error("Failed to import wallet")
      return
    }

    if (mnemonicPhrase && internWalletState?.walletIds.length === 0) {
      const evmAccount = mnemonicToAccount(mnemonicPhrase,
        {
          accountIndex: 0,
          addressIndex: 0,
        }
      );

      const encryptedBytes = await encrypt(bytes, password);
      if (!encryptedBytes) {
        toast.error("Failed to encrypt information")
        return
      }

      // Convert ArrayBuffer to string that can be properly decrypted later
      const encryptedBytesString = Array.from(new Uint8Array(encryptedBytes))
        .map(byte => byte.toString())
        .join(',');

      const newWalletId = `rpw/${name}/${encryptedBytesString}/signin:${evmAccount.address}+${name}:${address}`
      setInternWalletState({
        walletIds: [newWalletId],
        lastWalletId: newWalletId,
        isUnlocked: 0,
      })
      toast.success("Wallet imported")
    } else if (mnemonicPhrase && internWalletState?.walletIds.length !== 0) {
      // check if there already a rpk wallet
      const rpwWallet = internWalletState?.walletIds.find(walletId => walletId.startsWith("rpw/"));

      if (rpwWallet) {

        const newWalletId = `${rpwWallet}+${name}:${address}`

        setInternWalletState({
          walletIds: internWalletState?.walletIds.map(id => id === rpwWallet ? newWalletId : id) || [],
          lastWalletId: newWalletId,
          isUnlocked: 0,
        })
        toast.success("Wallet imported")
      } else {
        const evmAccount = mnemonicToAccount(mnemonicPhrase,
          {
            accountIndex: 0,
            addressIndex: 0,
          }
        );

        const encryptedBytes = await encrypt(bytes, password);
        if (!encryptedBytes) {
          toast.error("Failed to encrypt information")
          return
        }

        const encryptedBytesString = Array.from(new Uint8Array(encryptedBytes))
          .map(byte => byte.toString())
          .join(',');

        const newWalletId = `rpw/${name}/${encryptedBytesString}/signin:${evmAccount.address}+${name}:${address}`
        setInternWalletState({
          walletIds: internWalletState?.walletIds.map(id => id === rpwWallet ? newWalletId : id) || [],
          lastWalletId: newWalletId,
          isUnlocked: 0,
        })
        toast.success("Wallet imported")
      }
    } else {
      toast.error("Failed to import wallet")
      return
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Import watch only wallet</h1>
        <Ellipsis className="w-6 h-6" />
      </div>
      <div className="flex flex-col p-4">
        <div className="flex flex-col gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-4">
              <form.Field
                name="walletName"
                validators={{
                  onChange: ({ value }: { value: string }) =>
                    !value
                      ? "...waiting for a name"
                      : value.length < 3
                      ? "Wallet name must be at least 3 characters"
                      : undefined,
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
              <form.Field
                name="walletAddress"
                validators={{
                  onChange: ({ value }: { value: string }) =>
                    !value
                      ? "...waiting for an address"
                      : value.length < 42
                      ? "Wallet address must be at least 42 characters"
                      : undefined,
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
                      placeholder="Enter the wallet address"
                      className="w-full text-2xl outline-none"
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
              <p className="text-sm text-muted-foreground">Wallet information is automaticallyprotected with Passkey, but you can choose to use a Password instead.</p>
              <Button variant="secondary" className="w-fit" onClick={() => setWalletPasswordEnabled(!walletPasswordEnabled)}>
                {walletPasswordEnabled ? "Disable password" : "Enable password"}
              </Button>
              {
                walletPasswordEnabled && (
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
              )}
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
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Import />
                          Import
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form.Subscribe>
            </div>
          </form>
        </div>
      </div>
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
