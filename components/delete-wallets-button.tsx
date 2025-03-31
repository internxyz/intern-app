import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DeleteWalletsButton() {
  return (
    <Button variant="destructive" size="icon">
      <Trash />
      Delete all wallets
    </Button>
  );
}