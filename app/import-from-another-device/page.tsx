import Header from "@/components/header";
import ImportHandler from "@/components/import-handler";

export default function ImportFromAnotherDevice() {
  return (
    <div className="flex flex-col gap-4">
      <Header />
      <ImportHandler />
    </div>
  );
}
