"use client";

import { notFound } from "next/navigation";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { ActionDetails } from "./_components/ActionDetails";
import { ActionWithMembers } from "@/lib/types";
import LayoutTitle from "@/components/shared/LayoutTitle";

interface SingleActionPageProps {
  params: { actionId: Id<"actions"> };
}

export default function SingleActionPage({ params }: SingleActionPageProps) {
  let action: ActionWithMembers | undefined;

  try {
    action = useQuery(api.actions.get, {
      actionId: params.actionId,
    }) as ActionWithMembers;
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
          <LayoutTitle title={action.title as string} />
          <ActionDetails {...action} />
        </>
      )}
    </>
  );
}
