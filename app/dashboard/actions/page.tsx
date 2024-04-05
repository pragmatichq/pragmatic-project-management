"use client";

import React, { useContext, useEffect, useMemo } from "react";
import {
  useQueryState,
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  parseAsJson,
} from "nuqs";
import { api } from "@/convex/_generated/api";
import { useStableQuery } from "@/lib/hooks/useStableQuery";

import { DataTable } from "@/components/action-table/action-table";
import { getActionTableColumns } from "@/components/action-table/action-table-columns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FilterContext } from "./_contexts/FilterContext";
import NewAction from "./_components/NewAction";
import { BreadcrumbContext } from "../_contexts/BreadcrumbContext";
import { ColumnSort, ExpandedState } from "@tanstack/react-table";
import { createParser } from "nuqs";

const columnSortParser = createParser<ColumnSort[]>({
  parse(queryValue: string): ColumnSort[] | null {
    if (!queryValue) return null;
    return queryValue
      .split(";")
      .map((part) => {
        const [desc, id] = part.split(",");
        if ((desc !== "true" && desc !== "false") || !id) {
          return null; // invalid format
        }
        return { desc: desc === "true", id };
      })
      .filter((cs): cs is ColumnSort => cs !== null);
  },
  serialize(values: ColumnSort[]): string {
    return values.map((value) => `${value.desc},${value.id}`).join(";");
  },
});

const useArrayQueryState = (name: string) =>
  useQueryState(name, parseAsArrayOf(parseAsString).withDefault([]));

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
    parseAsJson().withDefault({
      "status:Planned": true,
      "status:In Progress": true,
    })
  );

  const isFiltered = [
    assigneesFilter,
    statusesFilter,
    flagsFilter,
    timeFramesFilter,
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
              <NewAction />
            </div>
          </div>
        </FilterContext.Provider>
      )}
    </>
  );
}
