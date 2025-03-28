import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";

export default function Header() {
  return (
    <header className="flex flex-row items-center justify-between">
      <Avatar>
        <AvatarImage src="/logo.svg" />
        <AvatarFallback>i</AvatarFallback>
      </Avatar>
      <Button variant="ghost" size="icon">
        <Scan className="w-4 h-4" />
      </Button>
    </header>
  );
}