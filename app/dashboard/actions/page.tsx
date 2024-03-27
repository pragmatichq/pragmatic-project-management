"use client";

import React from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { DataTable } from "@/components/action-table/action-table";
import { getActionTableColumns } from "@/components/action-table/action-table-columns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMemo } from "react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useStableQuery } from "@/lib/useStableQuery";

export default function actionListPage() {
  const columns = useMemo(() => getActionTableColumns(), []);

  const [statuses, setStatuses] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [timeFrames, setTimeFrames] = useQueryState(
    "timeframe",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [assignees, setAssignees] = useQueryState(
    "assignee",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const actions = useStableQuery(api.actions.list, {
    statuses: statuses,
    timeFrames: timeFrames,
    assignees: assignees,
  });

  console.log(actions);
  console.log(assignees);

  return (
    <>
      {!actions ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-col space-y-2 p-4">
            <span
              onClick={() => setAssignees(["user_2dukJSlNS0LNb6lNEdof9v4eU5o"])}
            >
              In Progress
            </span>
            <span
              onClick={() =>
                setAssignees([
                  "user_2dukJSlNS0LNb6lNEdof9v4eU5o",
                  "user_2ck6mnIbrGf8MDTLQ7ausqFmhH9",
                ])
              }
            >
              In Progress / Triage
            </span>
            <span onClick={() => setAssignees([])}>None</span>
            <h2 className="text-4xl font-bold tracking-tight">Action Table</h2>
            <p className="text-muted-foreground">
              Here's a list of all your team's current actions.
            </p>
            <DataTable data={actions} columns={columns} />
          </div>
        </>
      )}
    </>
  );
}
