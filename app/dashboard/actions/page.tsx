"use client";

import React, { useMemo } from "react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";

import { DataTable } from "@/components/action-table/action-table";
import { getActionTableColumns } from "@/components/action-table/action-table-columns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FilterContext } from "./FilterContext";
import NewAction from "./_components/NewAction";

const useArrayQueryState = (name: string) =>
  useQueryState(name, parseAsArrayOf(parseAsString).withDefault([]));

export default function ActionListPage() {
  const columns = useMemo(() => getActionTableColumns(), []);

  const [statuses, setStatuses] = useArrayQueryState("status");
  const [timeFrames, setTimeFrames] = useArrayQueryState("timeframe");
  const [assignees, setAssignees] = useArrayQueryState("assignee");
  const [flags, setFlags] = useArrayQueryState("flags");
  const [groupBy, setGroupBy] = useQueryState(
    "groupBy",
    parseAsArrayOf(parseAsString).withDefault(["status"])
  );
  console.log(groupBy);
  const isFiltered = [assignees, statuses, flags, timeFrames].some(
    (array) => array.length > 0
  );

  const createView = (savedView: string) => {
    if (isFiltered) {
      savedView = new URLSearchParams(window.location.search).toString();
    }
    return savedView;
  };

  let savedView = "";
  savedView = createView(savedView);

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
        <div className="flex flex-col space-y-2 p-4 max-h-screen overflow-scroll">
          <h2 className="text-4xl font-bold tracking-tight">Action Table</h2>
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
              groupBy,
              setGroupBy,
              isFiltered,
            }}
          >
            <DataTable data={actions} columns={columns} />
            <div className="flex justify-end">
              <NewAction />
            </div>
          </FilterContext.Provider>
        </div>
      )}
    </>
  );
}
