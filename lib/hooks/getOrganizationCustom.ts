export type Group = {
  value: string;
  order: number;
  default_expanded: boolean;
};

export const statuses: Group[] = [
  {
    value: "Planned",
    order: 2,
    default_expanded: true,
  },
  {
    value: "In Progress",
    order: 1,
    default_expanded: true,
  },
  {
    value: "On Hold",
    order: 3,
    default_expanded: false,
  },
  {
    value: "Completed",
    order: 4,
    default_expanded: false,
  },
  {
    value: "Cancelled",
    order: 5,
    default_expanded: false,
  },
];

export const time_frames: Group[] = [
  {
    value: "Today",
    order: 1,
    default_expanded: true,
  },
  {
    value: "This Week",
    order: 2,
    default_expanded: true,
  },
  {
    value: "Next Week",
    order: 3,
    default_expanded: true,
  },
];

export const flags = [
  {
    value: "Ready for Review",
  },
  {
    value: "Need Information",
  },
];
