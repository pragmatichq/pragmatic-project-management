type Status = {
  value: string;
  order: number;
};

export const statuses: Status[] = [
  {
    value: "In Consideration",
    order: 3,
  },
  {
    value: "Planned",
    order: 2,
  },
  {
    value: "In Progress",
    order: 1,
  },
  {
    value: "On Hold",
    order: 4,
  },
  {
    value: "Completed",
    order: 5,
  },
  {
    value: "Cancelled",
    order: 6,
  },
];

export const time_frames = [
  {
    value: "Today",
  },
  {
    value: "Next Week",
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
