"use client";

import React, { useContext, useEffect, useMemo } from "react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";

import { DataTable } from "@/components/action-table/action-table";
import { getActionTableColumns } from "@/components/action-table/action-table-columns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FilterContext } from "./_contexts/FilterContext";
import { CreateNewActionButton } from "./_components/ActionQueries";
import { BreadcrumbContext } from "../_contexts/BreadcrumbContext";
import { columnSortParser, useArrayQueryState } from "@/lib/queryStateHelpers";

export default function ActionListPage() {
  const { setBreadcrumbs } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumbs(["Action Table"]);
  }, []);

  const columns = useMemo(() => getActionTableColumns(), []);

  const [statusesFilter, setStatusesFilter] = useArrayQueryState("status");
  const [timeFramesFilter, setTimeFramesFilter] =
    useArrayQueryState("timeframe");
  const [assigneesFilter, setAssigneesFilter] = useArrayQueryState("assignee");
  const [flagsFilter, setFlagsFilter] = useArrayQueryState("flags");
  const [stakeholdersFilter, setStakeholdersFilter] =
    useArrayQueryState("stakeholders");
  const [groupBy, setGroupBy] = useQueryState(
    "groupBy",
    parseAsArrayOf(parseAsString).withDefault(["status"])
  );
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    columnSortParser.withDefault([{ desc: false, id: "status" }])
  );
  const [expandedGroups, setExpandedGroups] = useQueryState(
    "expanded",
    parseAsArrayOf(parseAsString).withDefault([
      "status:Planned",
      "status:In Progress",
    ])
  );

  const isFiltered = [
    assigneesFilter,
    statusesFilter,
    flagsFilter,
    timeFramesFilter,
    stakeholdersFilter,
  ].some((array) => array.length > 0);

  const createView = (savedView: string) => {
    if (isFiltered) {
      savedView = new URLSearchParams(window.location.search).toString();
    }
    return savedView;
  };

  let savedView = "";
  savedView = createView(savedView);

  const actions = useStableQuery(api.actions.list, {
    statuses: statusesFilter,
    timeFrames: timeFramesFilter,
    assignees: assigneesFilter,
    flags: flagsFilter,
    stakeholders: stakeholdersFilter,
  });

  return (
    <>
      {!actions ? (
        <LoadingSpinner />
      ) : (
        <FilterContext.Provider
          value={{
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
            groupBy,
            setGroupBy,
            sortBy,
            setSortBy,
            expandedGroups,
            setExpandedGroups,
            isFiltered,
          }}
        >
          <div className="flex flex-col space-y-2 p-6 max-h-[calc(100vh-45px)] overflow-auto">
            <DataTable data={actions} columns={columns} />
            <div className="flex justify-end">
              <CreateNewActionButton />
            </div>
          </div>
        </FilterContext.Provider>
      )}
    </>
  );
}
