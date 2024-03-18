"use client";

import React from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { DataTable } from "@/components/action-table/action-table";
import { getActionTableColumns } from "@/components/action-table/action-table-columns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMemo } from "react";

export default function actionListPage() {
  let actions: Array<Doc<"actions">> = useQuery(api.actions.list, {}) || [];
  const columns = useMemo(() => getActionTableColumns(), []);

  return (
    <>
      {!actions ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-col space-y-2 p-4">
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
