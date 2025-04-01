"use client";

import { Upload, Import, Unlock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";
import { InternWalletState } from "@/components/wallet-home";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAtom } from "jotai";
import { internWalletStateAtom } from "@/components/wallet-home";
import Link from "next/link";


export default function ImportFromAnotherDeviceHandler() {

  const scanRef = useRef<HTMLInputElement>(null);
  const [rawInternWalletState, setRawInternWalletState] =
    useState<InternWalletState | null>(null);

  const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>([]);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [internWalletState, setInternWalletState] = useAtom(internWalletStateAtom);

  const prepareScan = async () => {
    const html5QrCode = new Html5Qrcode(/* element id */ "qr-input-file");

    const onFileChange = () => {
      if (!scanRef.current) return;
      if (!scanRef.current?.files) return;
      if (scanRef.current?.files?.length == 0) return;

      const imageFile = scanRef.current.files[0];

      html5QrCode
        .scanFile(imageFile, true)
        .then((decodedText) => {
          setRawInternWalletState(JSON.parse(decodedText));
          toast.success("Upload succeeded");
        })
        .catch(() => {
          toast.error("Upload failed");
        });
    };

    scanRef.current?.addEventListener("change", onFileChange);

    return () => scanRef.current?.removeEventListener("change", onFileChange);
  };

  useEffect(() => {
    let removeListener: () => void = () => {};
    prepareScan().then((f) => (removeListener = f));
    return () => {
      removeListener();
    };
  }, []);

  function handleWalletSelection(walletId: string) {
    setSelectedWalletIds((prev) => {
      if (prev.includes(walletId)) {
        return prev.filter((id) => id !== walletId);
      }
      return [...prev, walletId];
    });
  }

  function handleImportWallet() {
    if (!rawInternWalletState) return;

    // Create new state with only selected wallets
    const filteredState: InternWalletState = {
      walletIds: rawInternWalletState.walletIds.filter(id => 
        selectedWalletIds.includes(id)
      ),
      lastWalletId: selectedWalletIds.includes(rawInternWalletState.lastWalletId) 
        ? rawInternWalletState.lastWalletId 
        : selectedWalletIds[0] || '',
      isUnlocked: false,
      // Copy over any remaining properties from the original state, except the ones we explicitly set
      ...Object.fromEntries(
        Object.entries(rawInternWalletState).filter(([key]) => 
          !['walletIds', 'lastWalletId', 'isUnlocked'].includes(key)
        )
      )
    };

    // console.log(filteredState);
    setInternWalletState(filteredState);
    toast.success("Wallets imported successfully");
  }

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-2">
        <div>Import Wallet</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 justify-end">
          <input
            ref={scanRef}
            id="qr-input-file"
            type="file"
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={(evt) => {
              evt.preventDefault();
              scanRef.current?.click();
            }}
            variant="outline"
            className="w-fit"
            size="lg"
          >
            <Upload />
            Upload
          </Button>
        </div>
      </div>
      {rawInternWalletState && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {rawInternWalletState.walletIds.map((walletId) => (
              <div className="flex flex-row items-center gap-4" key={walletId}>
                <Checkbox
                  id={walletId}
                  checked={selectedWalletIds.includes(walletId)}
                  onCheckedChange={() => handleWalletSelection(walletId)}
                />
                <div className="text-lg">{walletId.split("/")[0]}</div>
                {walletId.split("/")[0] ===
                  rawInternWalletState.lastWalletId.split("/")[0] && (
                  <Badge>Current</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <Button
        onClick={handleImportWallet}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] mx-auto"
        size="lg"
      >
        <Import />
        Import
      </Button>
      {
        internWalletState && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="text-lg">
              {internWalletState.walletIds.length} wallets imported
            </div>
            <Button 
              asChild
              className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] mx-auto"
              size="lg"
            >
              <Link href="/">
                <Unlock />
                Go to home
              </Link>
            </Button>
          </div>
        )
      }
    </div>
  );
}


