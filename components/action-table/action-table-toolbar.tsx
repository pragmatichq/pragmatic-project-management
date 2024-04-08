import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableFacetedFilter } from "@/components/action-table/action-table-faceted-filters";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";

import { useOrganization } from "@clerk/nextjs";

import { useMemo } from "react";

import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import {
  statuses,
  time_frames,
  flags,
} from "@/lib/hooks/getOrganizationCustom";

import type { Table } from "@tanstack/react-table";
import { Rows3Icon } from "lucide-react";
import { FilterContext } from "@/app/dashboard/actions/_contexts/FilterContext";
import { parseGroupStringWithDefaults } from "./parse-helpers";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const {
    statusesFilter,
    setStatusesFilter,
    timeFramesFilter,
    setTimeFramesFilter,
    flagsFilter,
    setFlagsFilter,
    assigneesFilter,
    setAssigneesFilter,
    stakeholdersFilter,
    setStakeholdersFilter,
    setGroupBy,
    setSortBy,
    setExpandedGroups,
    isFiltered,
  } = useContext(FilterContext);
  const { memberships, isLoaded } = useOrganization({ memberships: true });

  const members = useMemo(() => {
    if (!isLoaded || !memberships?.data) return [];
    return memberships.data.map((member) => ({
      value: member.publicUserData.userId,
      name: `${member.publicUserData.firstName} ${member.publicUserData.lastName}`,
    })) as { value: string }[];
  }, [memberships, isLoaded]);

  const currentGrouping = table.getState().grouping[0] || "";

  const handleGroupingChange = (value: string) => {
    const newGrouping = value === "" ? [] : [value];
    setGroupBy(newGrouping);
    setSortBy([{ id: value, desc: false }]);
    if (value === "status") {
      setExpandedGroups(parseGroupStringWithDefaults(statuses, "status"));
    } else {
      setExpandedGroups(
        parseGroupStringWithDefaults(time_frames, "time_frame")
      );
    }
  };

  return (
    <div className="flex items-center justify-between">
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
            setter={setStatusesFilter}
            filter={statusesFilter}
          />
        )}
        {table.getColumn("time_frame") && (
          <DataTableFacetedFilter
            column={table.getColumn("time_frame")}
            title="Time Frames"
            options={time_frames}
            setter={setTimeFramesFilter}
            filter={timeFramesFilter}
          />
        )}

        {table.getColumn("flags") && (
          <DataTableFacetedFilter
            column={table.getColumn("flags")}
            title="Flags"
            options={flags}
            setter={setFlagsFilter}
            filter={flagsFilter}
          />
        )}

        {table.getColumn("assignees") && (
          <DataTableFacetedFilter
            column={table.getColumn("assignees")}
            title="Assignees"
            options={members}
            setter={setAssigneesFilter}
            filter={assigneesFilter}
          />
        )}
        {table.getColumn("stakeholders") && (
          <DataTableFacetedFilter
            column={table.getColumn("stakeholders")}
            title="Stakeholders"
            options={members}
            setter={setStakeholdersFilter}
            filter={stakeholdersFilter}
          />
        )}
        {isFiltered ? (
          <Button
            variant="ghost"
            onClick={() => {
              setAssigneesFilter([]);
              setFlagsFilter([]);
              setStatusesFilter([]);
              setTimeFramesFilter([]);
              setStakeholdersFilter([]);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
            <Rows3Icon className="mr-2 h-4 w-4" />
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-2 hidden h-8 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
