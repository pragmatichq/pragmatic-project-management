import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function TaskModal({
  activeTask,
  projectTitle,
}: {
  activeTask: any;
  projectTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      router.back();
    }
  }, [open]);

  return (
    <Dialog defaultOpen open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl h-[90%]">
        <DialogHeader>
          <DialogDescription>{projectTitle}</DialogDescription>
          <DialogTitle>{activeTask?.title}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
