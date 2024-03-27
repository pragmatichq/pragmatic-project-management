"use client";

import React, { useMemo } from "react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/useStableQuery";

import { DataTable } from "@/components/action-table/action-table";
import { getActionTableColumns } from "@/components/action-table/action-table-columns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FilterContext } from "./FilterContext";

const useArrayQueryState = (name: string) =>
  useQueryState(name, parseAsArrayOf(parseAsString).withDefault([]));

export default function ActionListPage() {
  const columns = useMemo(() => getActionTableColumns(), []);

  const [statuses, setStatuses] = useArrayQueryState("status");
  const [timeFrames, setTimeFrames] = useArrayQueryState("timeframe");
  const [assignees, setAssignees] = useArrayQueryState("assignee");
  const [flags, setFlags] = useArrayQueryState("flags");
  const isFiltered = [assignees, statuses, flags, timeFrames].some(
    (array) => array.length > 0
  );

  const createView = () => {
    if (isFiltered) {
      console.log(new URLSearchParams(window.location.search).toString());
    }
  };

  const actions = useStableQuery(api.actions.list, {
    statuses,
    timeFrames,
    assignees,
    flags,
  });

  return (
    <>
      {!actions ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col space-y-2 p-4">
          <h2 className="text-4xl font-bold tracking-tight">Action Table</h2>
          <p className="text-muted-foreground">
            Here's a list of all your team's current actions.{" "}
            <span className="cursor-pointer" onClick={createView}>
              Save View
            </span>
          </p>
          <FilterContext.Provider
            value={{
              statuses,
              setStatuses,
              timeFrames,
              setTimeFrames,
              flags,
              setFlags,
              assignees,
              setAssignees,
              isFiltered,
            }}
          >
            <DataTable data={actions} columns={columns} />
          </FilterContext.Provider>
        </div>
      )}
    </>
  );
}
