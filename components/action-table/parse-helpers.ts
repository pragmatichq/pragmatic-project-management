import { Group } from "@/lib/hooks/getOrganizationCustom";

interface Acc {
  [key: string]: boolean;
}

export const parseExpanded = (expanded: string[]) => {
  return expanded.reduce((acc: Acc, group) => {
    acc[group] = true;
    return acc;
  }, {});
};

export const parseGroupStringWithDefaults = (
  groupStates: Group[],
  group: string
) => {
  return groupStates
    .filter((frame) => frame.default_expanded) // Filter array to include only items with default_open === true
    .reduce((acc: string[], { value }) => {
      acc.push(`${group}:${value}`);
      return acc;
    }, []);
};
