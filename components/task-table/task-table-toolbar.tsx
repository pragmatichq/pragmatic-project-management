import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableFacetedFilter } from "@/components/task-table/task-table-faceted-filter";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";

import { useOrganization } from "@clerk/nextjs";

import { useMemo } from "react";

import { MixerHorizontalIcon } from "@radix-ui/react-icons";

const statuses = [
  {
    value: "Triage",
  },
  {
    value: "In Progress",
  },
  {
    value: "Next Up",
  },
  {
    value: "Consideration",
  },
];

const time_frames = [
  {
    value: "Today",
  },
  {
    value: "Next Week",
  },
];

const flags = [
  {
    value: "Ready for Review",
  },
  {
    value: "Need Information",
  },
];

import type { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { memberships, isLoaded } = useOrganization({ memberships: true });

  const assignees = useMemo(() => {
    if (!isLoaded || !memberships?.data) return [];
    return memberships.data.map((member) => ({
      value: member.publicUserData.userId,
      name: `${member.publicUserData.firstName} ${member.publicUserData.lastName}`,
    })) as { value: string }[];
  }, [memberships, isLoaded]);

  const isFiltered = table.getState().columnFilters.length > 0;
  const currentGrouping = table.getState().grouping[0] || "";

  const handleGroupingChange = (value: string) => {
    const newGrouping = value === "" ? [] : [value];
    table.setGrouping(newGrouping);
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("time_frame") && (
          <DataTableFacetedFilter
            column={table.getColumn("time_frame")}
            title="Time Frames"
            options={time_frames}
          />
        )}

        {table.getColumn("flags") && (
          <DataTableFacetedFilter
            column={table.getColumn("flags")}
            title="Flags"
            options={flags}
          />
        )}

        {table.getColumn("assignees") && (
          <DataTableFacetedFilter
            column={table.getColumn("assignees")}
            title="Assignees"
            options={assignees}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            Group By
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Group By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={currentGrouping}
            onValueChange={handleGroupingChange}
          >
            <DropdownMenuRadioItem value="">None</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="time_frame">
              Time Frame
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
