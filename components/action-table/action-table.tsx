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
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { FilterContext } from "@/app/dashboard/actions/FilterContext";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { groupBy } = useContext(FilterContext);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [grouping, setGrouping] = useState<GroupingState>(groupBy);

  useEffect(() => {
    setGrouping(groupBy);
  }, [groupBy]);

  const table = useReactTable({
    data,
    columns,
    onGroupingChange: setGrouping,
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      grouping,
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
                          <span className="font-bold">
                            {!isUngrouped ? (
                              groupedValue
                            ) : (
                              <span>Ungrouped</span>
                            )}
                          </span>
                        </TableCell>
                      </TableRow>
                      {row.subRows.map((subRow) => (
                        <TableRow key={subRow.id}>
                          {subRow.getVisibleCells().map((cell) => (
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
                      ))}
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
