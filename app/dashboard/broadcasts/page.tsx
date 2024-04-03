"use client";

import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";
import { BroadcastEditor } from "@/components/editor/BroadcastEditor";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";

export default function BroadcastsPage() {
  const broadcasts = useQuery(api.broadcasts.list, {});
  const [activeBroadcast, setActiveBroadcast] = useState<
    Id<"broadcasts"> | undefined
  >(undefined);
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h2 className="text-4xl font-bold tracking-tight">Broadcasts</h2>
      {broadcasts?.map((broadcast) => (
        <Button
          onClick={() => setActiveBroadcast(broadcast._id)}
          key={broadcast._id}
        >
          {broadcast.title}
        </Button>
      ))}
      <BroadcastEditor broadcastId={activeBroadcast} />
    </div>
  );
}
