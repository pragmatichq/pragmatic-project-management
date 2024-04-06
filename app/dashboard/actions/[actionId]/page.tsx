"use client";

import { notFound } from "next/navigation";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { ActionDetails } from "./_components/ActionDetails";
import { ActionWithMembers } from "@/lib/types";
import LayoutTitle from "@/app/dashboard/_components/DashboardBreadcrumbs";
import { useContext, useEffect } from "react";
import { BreadcrumbContext } from "../../_contexts/BreadcrumbContext";
import { useStableQuery } from "@/lib/hooks/useStableQuery";

interface SingleActionPageProps {
  params: { actionId: Id<"actions"> };
}

export default function SingleActionPage({ params }: SingleActionPageProps) {
  let action: ActionWithMembers | undefined;

  try {
    action = useStableQuery(api.actions.get, {
      actionId: params.actionId,
    }) as ActionWithMembers;
  } catch (e) {
    if (e instanceof Error && e.message.includes("ArgumentValidationError")) {
      notFound();
    } else {
      throw e;
    }
  }

  const { setBreadcrumbs } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumbs(["Actions", action?.title!]);
  }, [action]);

  return <>{!action ? <LoadingSpinner /> : <ActionDetails {...action} />}</>;
}
