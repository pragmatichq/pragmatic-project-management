"use client";

import { formatDistanceToNow } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/action-table/action-table-column-header";

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

import { FlagSelector } from "@/components/shared/flag-selector";
import { StatusSelector } from "@/components/shared/status-selector";
import { Badge } from "@/components/ui/badge";

import { Doc } from "@/convex/_generated/dataModel";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export const getActionTableColumns = (): ColumnDef<Doc<"actions">>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: (info) => {
      const value = info.getValue();
      const { orgSlug } = useAuth();
      if (typeof value === "string") {
        return (
          <Link
            href={"/" + orgSlug + `/dashboard/action/${info.row.original._id}`}
            className="hover:underline"
          >
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
            actionId={info.row.original._id}
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
            actionId={info.row.original._id}
            flags={flagsValue as []}
          />
        );
      } else {
        return (
          <FlagSelector actionId={info.row.original._id} flags={flagsValue} />
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
        return <DueDate actionId={info.row.original._id} dueDate={value} />;
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
            actionId={info.row.original._id}
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
];
