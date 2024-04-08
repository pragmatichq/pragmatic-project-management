"use client";

import { Button } from "@/components/ui/button";
import { NotebookPenIcon, PlusCircleIcon } from "lucide-react";
import { useContext, useEffect } from "react";
import { BreadcrumbContext } from "../_contexts/BreadcrumbContext";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";

export default function BroadcastsPage() {
  const { setBreadcrumbs } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumbs(["Broadcasts"]);
  }, []);

  const router = useRouter();

  const createBroadcast = useMutation(api.broadcasts.create);

  const createNewBroadcast = async () => {
    const newBroadcast = await createBroadcast();
    router.push(`/dashboard/broadcasts/${newBroadcast}`);
  };

  const broadcasts = useStableQuery(api.broadcasts.list, {});

  return (
    <div className="mx-auto text-center flex flex-col gap-8 p-6 rounded bg-muted text-muted-foreground border w-2/3">
      <NotebookPenIcon className="mx-auto size-12" />
      {broadcasts && broadcasts.length > 0 ? (
        <span>
          Create a new broadcast, or choose an existing broadcast to edit.
        </span>
      ) : (
        <span>Create your first broadcast!</span>
      )}
      <Button className="w-fit mx-auto" onClick={createNewBroadcast}>
        <PlusCircleIcon className="mr-2 h-4 w-4" />
        New Broadcast
      </Button>
    </div>
  );
}
