import { ColumnSort, ExpandedState } from "@tanstack/react-table";
import { createContext } from "react";

export type FilterContextType = {
  statusesFilter: string[];
  setStatusesFilter: React.Dispatch<React.SetStateAction<string[]>>;
  timeFramesFilter: string[];
  setTimeFramesFilter: React.Dispatch<React.SetStateAction<string[]>>;
  flagsFilter: string[];
  setFlagsFilter: React.Dispatch<React.SetStateAction<string[]>>;
  assigneesFilter: string[];
  setAssigneesFilter: React.Dispatch<React.SetStateAction<string[]>>;
  stakeholdersFilter: string[];
  setStakeholdersFilter: React.Dispatch<React.SetStateAction<string[]>>;
  groupBy: string[];
  setGroupBy: React.Dispatch<React.SetStateAction<string[]>>;
  sortBy: ColumnSort[];
  setSortBy: React.Dispatch<React.SetStateAction<ColumnSort[]>>;
  expandedGroups: string[];
  setExpandedGroups: React.Dispatch<React.SetStateAction<string[]>>;
  isFiltered: boolean;
};

export const FilterContext = createContext<FilterContextType>({
  statusesFilter: [],
  setStatusesFilter: () => {},
  timeFramesFilter: [],
  setTimeFramesFilter: () => {},
  flagsFilter: [],
  setFlagsFilter: () => {},
  assigneesFilter: [],
  setAssigneesFilter: () => {},
  stakeholdersFilter: [],
  setStakeholdersFilter: () => {},
  groupBy: [],
  setGroupBy: () => {},
  sortBy: [],
  setSortBy: () => {},
  expandedGroups: [],
  setExpandedGroups: () => {},
  isFiltered: false,
});
