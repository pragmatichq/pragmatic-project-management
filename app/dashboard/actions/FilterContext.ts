import { createContext } from "react";

export type FilterContextType = {
  statuses: string[];
  setStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  timeFrames: string[];
  setTimeFrames: React.Dispatch<React.SetStateAction<string[]>>;
  flags: string[];
  setFlags: React.Dispatch<React.SetStateAction<string[]>>;
  assignees: string[];
  setAssignees: React.Dispatch<React.SetStateAction<string[]>>;
};

export const FilterContext = createContext<FilterContextType>({
  statuses: [],
  setStatuses: () => {},
  timeFrames: [],
  setTimeFrames: () => {},
  flags: [],
  setFlags: () => {},
  assignees: [],
  setAssignees: () => {},
});
