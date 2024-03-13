"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { formatDistanceToNow } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/TaskTable/DataTable";
import { DataTableColumnHeader } from "@/components/TaskTable/DataTableColumnHeader";

import React, { useMemo } from "react";

import { AssigneeList } from "@/components/shared/assignee-list";
import { DueDate } from "@/components/shared/due-date";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardContent } from "@/components/ui/card";
import { FlagSelector } from "@/components/shared/flag-selector";
import { StatusSelector } from "@/components/shared/status-selector";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function taskListPage() {
  let tasks: Array<Doc<"tasks">> = useQuery(api.tasks.list, {}) || [];

  const columns: ColumnDef<Doc<"tasks">>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string") {
            return (
              <Link href={`/dashboard/task/${info.row.original._id}`}>
                {value}
              </Link>
            );
          }
          return "N/A";
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string") {
            return (
              <StatusSelector
                currentStatus={value}
                taskID={info.row.original._id}
              />
            );
          }
          return "N/A";
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "time_frame",

        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Time Frame" />
        ),
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string") {
            return <Badge variant="secondary">{value}</Badge>;
          }
          return "N/A";
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "flags",
        header: "Flags",
        cell: (info) => {
          let flagsValue = info.getValue();

          if (
            !Array.isArray(flagsValue) ||
            !flagsValue.every((item) => typeof item === "string")
          ) {
            flagsValue = [];
            return (
              <FlagSelector
                task={info.row.original._id}
                flags={flagsValue as []}
              />
            );
          } else {
            return (
              <FlagSelector task={info.row.original._id} flags={flagsValue} />
            );
          }
        },
        filterFn: (row, id, filterValues) => {
          const filterValArray = Array.isArray(filterValues)
            ? filterValues
            : [filterValues];
          const rowValue = row.getValue(id);

          if (Array.isArray(rowValue)) {
            return rowValue.some((val) => filterValArray.includes(val));
          }

          return filterValArray.includes(rowValue);
        },
      },
      {
        accessorKey: "due_date",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Due Date" />
        ),
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string") {
            return <DueDate taskId={info.row.original._id} dueDate={value} />;
          }
          return "N/A";
        },
      },
      {
        accessorKey: "assignees",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Assignees" />
        ),
        cell: (info) => {
          const assigneesValue = info.getValue();
          const isArrayOfStrings =
            Array.isArray(assigneesValue) &&
            assigneesValue.every((item) => typeof item === "string");

          if (isArrayOfStrings) {
            return (
              <AssigneeList
                taskId={info.row.original._id}
                assignees={assigneesValue}
              />
            );
          }
        },
        filterFn: (row, id, filterValues) => {
          const filterValArray = Array.isArray(filterValues)
            ? filterValues
            : [filterValues];
          const rowValue = row.getValue(id);

          if (Array.isArray(rowValue)) {
            return rowValue.some((val) => filterValArray.includes(val));
          }

          return filterValArray.includes(rowValue);
        },
      },
      {
        accessorKey: "last_updated",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Updated" />
        ),
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === "string") {
            return formatDistanceToNow(value, {
              addSuffix: true,
            });
          }
          return "N/A";
        },
      },
      {
        id: "actions",
        cell: () => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  return (
    <Card className="m-2">
      <CardContent className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
            <p className="text-muted-foreground">
              Here's a list of all current tasks.
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </CardContent>
    </Card>
  );
}
