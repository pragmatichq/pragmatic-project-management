"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/action-table/action-table-column-header";

import { MemberSelector } from "@/components/shared/MemberSelector";
import { DueDate } from "@/components/shared/DateSelector";
import { FlagSelector } from "@/components/shared/FlagSelector";
import { StatusSelector } from "@/components/shared/StatusSelector";
import { Badge } from "@/components/ui/badge";

import { Doc } from "@/convex/_generated/dataModel";

import Link from "next/link";
import ContextMenu from "@/app/dashboard/actions/_components/ActionContextMenu";
import useRelativeDate from "@/lib/hooks/useRelativeDate";

import { statuses, time_frames } from "@/lib/hooks/getOrganizationCustom";

const statusMapping: { [key: string]: number } = {};

statuses.reduce((acc, status) => {
  acc[status.value] = status.order;
  return acc;
}, statusMapping);

const timeFrameMapping: { [key: string]: number } = {};

time_frames.reduce((acc, status) => {
  acc[status.value] = status.order;
  return acc;
}, timeFrameMapping);

export const getActionTableColumns = (): ColumnDef<Doc<"actions">>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: (info) => {
      const value = info.getValue();
      if (typeof value === "string") {
        return (
          <Link
            href={`/dashboard/actions/${info.row.original._id}`}
            className="hover:underline block min-w-[250px] max-w-[450px] truncate"
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
        return <StatusSelector action={info.row.original} />;
      }
      return "N/A";
    },
    sortingFn: (rowA, rowB, columnId) => {
      const valueA: string = rowA.getValue(columnId);
      const valueB: string = rowB.getValue(columnId);

      // Get the order from the statusMapping object
      const orderA = statusMapping[valueA] || 0;
      const orderB = statusMapping[valueB] || 0;

      return orderA - orderB; // Compare by order
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
    sortingFn: (rowA, rowB, columnId) => {
      const valueA: string = rowA.getValue(columnId);
      const valueB: string = rowB.getValue(columnId);

      // Get the order from the statusMapping object
      const orderA = timeFrameMapping[valueA] || 0;
      const orderB = timeFrameMapping[valueB] || 0;

      return orderA - orderB; // Compare by order
    },
  },
  {
    accessorKey: "flags",
    header: "Flags",
    cell: (info) => {
      return <FlagSelector action={info.row.original} />;
    },
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    sortUndefined: 1,
    cell: (info) => {
      const value = info.getValue();
      if (typeof value === "string") {
        return <DueDate action={info.row.original} />;
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
      return (
        <MemberSelector action={info.row.original as any} purpose="assignees" />
      );
    },
  },
  {
    accessorKey: "stakeholders",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stakeholders" />
    ),
    cell: (info) => {
      return (
        <MemberSelector
          action={info.row.original as any}
          purpose="stakeholders"
        />
      );
    },
  },
  {
    accessorKey: "last_updated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: (info) => {
      const value = info.getValue();
      if (value === "") return "N/A";
      if (typeof value === "string") {
        return useRelativeDate(value);
      }
      return "N/A";
    },
    sortDescFirst: true,
  },
  {
    id: "actions",
    cell: (info) => {
      return <ContextMenu action={info.row.original} />;
    },
  },
];
