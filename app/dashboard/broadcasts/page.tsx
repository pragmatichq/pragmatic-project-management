"use client";

import { Button } from "@/components/ui/button";
import { NotebookPenIcon, PlusCircleIcon } from "lucide-react";

export default function BroadcastsPage() {
  return (
    <div className="mx-auto text-center flex flex-col gap-8 p-8 rounded bg-muted text-muted-foreground border">
      <NotebookPenIcon className="mx-auto size-12" />
      <span>
        Start a new broadcast, or choose an existing broadcast to edit.
      </span>
      <Button className="w-fit mx-auto">
        <PlusCircleIcon className="mr-2 h-4 w-4" />
        New Broadcast
      </Button>
    </div>
  );
}
