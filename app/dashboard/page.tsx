"use client";

import React from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { DataTable } from "@/components/task-table/task-table";
import { getTaskTableColumns } from "@/components/task-table/task-table-columns";
import { useMemo } from "react";

export default function taskListPage() {
  let tasks: Array<Doc<"tasks">> = useQuery(api.tasks.list, {}) || [];
  const columns = useMemo(() => getTaskTableColumns(), []);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className="text-muted-foreground">
            Here's a list of all current tasks.
          </p>
        </div>
      </div>
      <DataTable data={tasks} columns={columns} />
    </>
  );
}
