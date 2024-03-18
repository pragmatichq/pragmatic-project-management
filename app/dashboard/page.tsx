"use client";

import React from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { DataTable } from "@/components/task-table/task-table";
import { getTaskTableColumns } from "@/components/task-table/task-table-columns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMemo } from "react";

export default function taskListPage() {
  let tasks: Array<Doc<"tasks">> = useQuery(api.tasks.list, {}) || [];
  const columns = useMemo(() => getTaskTableColumns(), []);

  return (
    <>
      {!tasks ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-col space-y-2 p-4">
            <h2 className="text-4xl font-bold tracking-tight">All Tasks</h2>
            <p className="text-muted-foreground">
              Here's a list of all current tasks.
            </p>
            <DataTable data={tasks} columns={columns} />
          </div>
        </>
      )}
    </>
  );
}
