"use client";

import { useStableQuery } from "@/lib/hooks/useStableQuery";
import { api } from "@/convex/_generated/api";
import KanbanBoard from "./KanbanBoard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function RoadmapPage() {
  const defaultActions = useStableQuery(api.actions.list, {});
  console.log(defaultActions);

  return (
    <>
      {defaultActions ? (
        <KanbanBoard actions={defaultActions} />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
