import ImportFromAnotherDeviceHandler from "@/components/import-from-another-device-handler";
import Link from "next/link";
import { Settings, BadgeInfo, Ellipsis, Plus } from "lucide-react";

export default function ImportFromAnotherDevice() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Link href="/settings">
          <Settings className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Import</h1>
        <BadgeInfo className="w-6 h-6" />
      </div>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">From another device</h2>
        <div className="flex flex-row items-center gap-4">
          <Ellipsis className="w-4 h-4" />
          <Plus className="w-4 h-4" />
        </div>
      </div>
      <ImportFromAnotherDeviceHandler />
    </div>
  );
}
