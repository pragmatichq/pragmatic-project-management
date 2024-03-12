"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/DataTable";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";

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

export default function taskListPage() {
  let tasks: Array<Doc<"tasks">> = useQuery(api.tasks.list, {}) || [];

  const columns: ColumnDef<Doc<"tasks">>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
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
            return new Date(value).toLocaleString();
          }
          return "N/A";
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
        accessorKey: "time_frame",
        header: "Time Frame",
      },
      {
        accessorKey: "flags",
        header: "Flags",
      },
      {
        accessorKey: "assignees",
        header: "Assignees",
        cell: (info) => {
          const assigneesValue = info.getValue();
          const isArrayOfStrings =
            Array.isArray(assigneesValue) &&
            assigneesValue.every((item) => typeof item === "string");

          if (isArrayOfStrings) {
            return (
              <AssigneeList
                task={info.row.original._id}
                assignees={assigneesValue}
              />
            );
          }
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
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </CardContent>
    </Card>
  );
}
