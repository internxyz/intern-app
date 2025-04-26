import { truncateAddress, truncateLongText } from "@/lib/utils";
import { InternWalletState } from "@/components/wallet-home";
import { toast } from "sonner";

export default function WalletShortAddress({
  internWalletState,
}: {
  internWalletState: InternWalletState;
}) {
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Address copied!");
  }

  return (
    <>
      {internWalletState.lastWalletId ? (
        <button
          className="text-md font-semibold text-muted-foreground"
          onClick={() =>
            copyToClipboard(
              internWalletState.lastWalletId
                .split("/")[3]
                .split(":")[1]
                .split("+")[0]
            )
          }
        >
          {truncateLongText(internWalletState.lastWalletId.split("/")[1])}
        </button>
      ) : (
        <button
          className="text-md font-semibold text-muted-foreground"
          onClick={() =>
            copyToClipboard(
              internWalletState.lastWalletId.split("/")[3].split(":")[1]
            )
          }
        >
          {truncateAddress(internWalletState.lastWalletId.split("/")[3])}
        </button>
      )}
    </>
  );
}
