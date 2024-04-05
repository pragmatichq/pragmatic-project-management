type Status = {
  value: string;
  order: number;
};

// Define the statuses array with the Status type
export const statuses: Status[] = [
  {
    value: "Consideration",
    order: 1,
  },
  {
    value: "Planned",
    order: 2,
  },
  {
    value: "In Progress",
    order: 3,
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
