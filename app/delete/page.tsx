"use client";

import { useState, useEffect, useRef } from "react";
import { BadgeInfo, TriangleAlert, ArrowLeft, Trash, X, CircleSlash2 } from "lucide-react";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { internWalletStateAtom } from "@/components/wallet-home";

export default function DeletePage() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [internWalletState, setInternWalletState] = useAtom(internWalletStateAtom);
  const [progress, setProgress] = useState(0);

  const [isHolding, setIsHolding] = useState(false);
  const holdDuration = 3000; // 3 seconds to complete
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHolding = () => {
    if (intervalRef.current) return;
    
    setIsHolding(true);
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / holdDuration) * 100, 100);
      setProgress(Math.round(newProgress));

      if (newProgress >= 100) {
        stopHolding();
        deleteAllWallets();
      }
    }, 100);
  };

  const stopHolding = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  function deleteAllWallets() {
    console.log("all wallet deleted");
    setInternWalletState(RESET);
  }

  if (!internWalletState) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Delete</h1>
          <BadgeInfo className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-4 items-center justify-center h-[300px]">
          <CircleSlash2 className="w-12 h-12" />
          <p className="text-lg font-semibold">No wallet found</p>
        </div>
      </div>
    );
  }

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Delete</h1>
          <BadgeInfo className="w-6 h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Delete</h1>
        <BadgeInfo className="w-6 h-6" />
      </div>
      <div className="flex flex-row justify-start items-start h-30 gap-4 p-4 rounded-md bg-destructive">
        <TriangleAlert className="w-12 h-12" />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            You are about to delete all your wallets. This action cannot be
            undone.
          </h2>
        </div>
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="lg" variant="destructive">
            <Trash />
            Delete all wallets
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[300px]">
          <DrawerHeader>
            <DrawerTitle>
              <div className="flex flex-row items-center justify-between">
                <div className="text-xl">Delete all wallets</div>
                <DrawerClose asChild>
                  <Button variant="secondary" size="icon">
                    <X />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerTitle>
            <DrawerDescription>
              Are you sure you want to delete all your wallets? This action
              cannot be undone.
            </DrawerDescription>
            <div className="h-[2px] w-full rounded-full bg-muted mt-4" />
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 pb-6 mt-2">
            <Progress value={progress} />
            <Button
              variant="destructive"
              size="lg"
              className={`w-full relative overflow-hidden transition-all duration-200 ${
                isHolding
                  ? "ring-2 ring-offset-4 ring-destructive/50 ring-offset-background ring-opacity-100"
                  : ""
              } select-none touch-none`}
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onMouseLeave={stopHolding}
              onTouchStart={(e) => {
                e.preventDefault();
                startHolding();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopHolding();
              }}
              onTouchCancel={(e) => {
                e.preventDefault();
                stopHolding();
              }}
            >
              <Trash />
              Hold to Delete
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
