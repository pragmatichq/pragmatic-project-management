"use client";

import { notFound } from "next/navigation";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { ActionDetails } from "@/components/action/action-details";

interface SingleActionPageProps {
  params: { actionId: Id<"actions"> };
}

interface ActionWithMembers extends Doc<"actions"> {
  assignees: string[];
  stakeholders: string[];
}

export default function SingleActionPage({ params }: SingleActionPageProps) {
  let action: Doc<"actions"> | undefined;

  try {
    action = useQuery(api.actions.get, {
      actionId: params.actionId,
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes("ArgumentValidationError")) {
      notFound();
    } else {
      throw e;
    }
  }

  return (
    <>
      {!action ? (
        <LoadingSpinner />
      ) : (
        <>
          <ActionDetails action={action as ActionWithMembers} />
        </>
      )}
    </>
  );
}
