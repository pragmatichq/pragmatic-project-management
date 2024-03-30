import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import Link from "next/link";

export default function ContextMenu({ action }: { action: any }) {
  const removeAction = useMutation(api.actions.remove);
  const handleArchive = async (actionId: Id<"actions">) => {
    const response = await removeAction({ actionId });
    toast.success("Action deleted");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href={`/dashboard/actions/${action._id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            navigator.clipboard.writeText(`/dashboard/actions/${action._id}`)
          }
        >
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleArchive(action._id)}>
          Archive
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleArchive(action._id)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
