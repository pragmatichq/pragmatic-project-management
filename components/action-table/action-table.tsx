"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  GroupingState,
  getGroupedRowModel,
  getExpandedRowModel,
  ExpandedState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "@/components/action-table/action-table-toolbar";
import { FilterContext } from "@/app/dashboard/actions/_contexts/FilterContext";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { groupBy, sortBy, expandedGroups, setExpandedGroups } =
    useContext(FilterContext);
  const [sorting, setSorting] = useState<SortingState>(sortBy);
  const [grouping, setGrouping] = useState<GroupingState>(groupBy);
  const [expanded, setExpanded] = useState<ExpandedState>(expandedGroups);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    setGrouping(groupBy);
    setSorting(sortBy);
    setExpanded(expandedGroups);
  }, [groupBy, sortBy, expandedGroups]);

  const toggleExpandedGroups = (groupName: string) => {
    if (expandedGroups.hasOwnProperty(groupName)) {
      // @ts-ignore
      const { [groupName]: _, ...newExpandedGroups } = expandedGroups;
      return newExpandedGroups;
    } else {
      // @ts-ignore
      return { ...expandedGroups, [groupName]: true };
    }
  };

  const table = useReactTable({
    data,
    columns,
    groupedColumnMode: false,
    autoResetExpanded: false,
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      grouping,
      expanded,
      columnVisibility,
    },
    defaultColumn: { minSize: 150, maxSize: 400 },
  });
  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                if (row.getIsGrouped()) {
                  const groupingColumnId = grouping[0];
                  const groupedValue: string | string[] = row.getValue(
                    groupingColumnId
                  ) as string | string[];
                  const isUngrouped =
                    groupedValue === "" ||
                    (Array.isArray(groupedValue) && groupedValue.length === 0);

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow>
                        <TableCell
                          className="bg-gray-700 text-white"
                          colSpan={columns.length}
                        >
                          <Button
                            className="font-bold flex items-center p-1 pr-2 -ml-2"
                            onClick={() => {
                              setExpandedGroups(toggleExpandedGroups(row.id));
                              console.log(row);
                            }}
                            variant={"ghost"}
                          >
                            {row.getIsExpanded() ? (
                              <ChevronDown className="mr-1" />
                            ) : (
                              <ChevronRight className="mr-1" />
                            )}
                            {!isUngrouped ? (
                              groupedValue + " (" + row.subRows.length + ")"
                            ) : (
                              <span>Ungrouped</span>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                } else {
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="max-w-[300px] truncate"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                }
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
