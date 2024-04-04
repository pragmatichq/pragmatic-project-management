"use client";

import { notFound } from "next/navigation";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BroadcastEditor } from "./_components/BroadcastEditor";
import { useContext, useEffect } from "react";
import { LayoutContext } from "../../_contexts/LayoutContext";

interface SingleBroadcastPageProps {
  params: { broadcastId: Id<"broadcasts"> };
}

export default function SingleBroadcast({ params }: SingleBroadcastPageProps) {
  let broadcast: Doc<"broadcasts"> | undefined;

  try {
    broadcast = useQuery(api.broadcasts.get, {
      broadcastId: params.broadcastId,
    }) as Doc<"broadcasts">;
  } catch (e) {
    if (e instanceof Error && e.message.includes("ArgumentValidationError")) {
      notFound();
    } else {
      throw e;
    }
  }

  const { setBreadcrumbs } = useContext(LayoutContext);

  useEffect(() => {
    setBreadcrumbs(["Broadcasts", broadcast?.title!]);
  }, []);

  return (
    <>
      {!broadcast ? (
        <LoadingSpinner />
      ) : (
        <>
          <BroadcastEditor broadcast={broadcast} />
        </>
      )}
    </>
  );
}
