import { PlusCircleIcon } from "lucide-react";

export default function AddItemPlaceholder() {
  return (
    <div className="w-full text-muted-foreground flex pl-2 min-w-[50px]">
      <PlusCircleIcon className="w-4 h-4" />
    </div>
  );
}
