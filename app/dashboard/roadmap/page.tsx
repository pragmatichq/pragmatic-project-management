"use client";

import { useStableQuery } from "@/lib/hooks/useStableQuery";
import { api } from "@/convex/_generated/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import RoadmapPortal from "./RoadmapKanban";

export default function RoadmapPage() {
  const defaultActions = useStableQuery(api.actions.list, {});

  return (
    <>
      {defaultActions ? (
        <RoadmapPortal actionsData={defaultActions} />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
