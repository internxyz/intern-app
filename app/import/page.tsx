"use client";

import Header from "@/components/header";
import ImportHandler from "@/components/import-handler";

export default function ImportWallet() {

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <ImportHandler />
    </div>
  )
}