"use client";

import { notFound } from "next/navigation";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { ActionDetails } from "./_components/ActionDetails";
import { ActionWithMembers } from "@/lib/types";
import LayoutTitle from "@/components/shared/LayoutTitle";
import { useContext, useEffect } from "react";
import { LayoutContext } from "../../_contexts/LayoutContext";

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

  const { setBreadcrumbs } = useContext(LayoutContext);

  useEffect(() => {
    setBreadcrumbs(["Actions", action?.title!]);
  }, [action]);

  return <>{!action ? <LoadingSpinner /> : <ActionDetails {...action} />}</>;
}
