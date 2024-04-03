"use client";

import { notFound } from "next/navigation";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { ActionDetails } from "@/components/action/action-details";
import { ActionWithMembers } from "@/lib/types";
import { BroadcastEditor } from "./_components/BroadcastEditor";

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
