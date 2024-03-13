"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useRouter } from "next/navigation";

export default function TaskModal() {
  const router = useRouter();

  return (
    <Dialog defaultOpen={true} onOpenChange={() => router.back()}>
      <DialogContent>
        <h1 className="text-4xl font-bold mb-4 text-black">Hello World</h1>
      </DialogContent>
    </Dialog>
  );
}
