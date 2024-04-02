"use client";

import { BroadcastEditor } from "@/components/editor/BroadcastEditor";
import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";

export default function BroadcastsPage() {
  const broadcasts = useStableQuery(api.broadcasts.list, {});
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h2 className="text-4xl font-bold tracking-tight">Broadcasts</h2>
      {broadcasts?.map((broadcast) => (
        <BroadcastEditor broadcast={broadcast} />
      ))}
    </div>
  );
}
