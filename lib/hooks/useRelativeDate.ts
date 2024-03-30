import { formatDistanceToNowStrict } from "date-fns";

export default function useRelativeDate(value: string) {
  const relativeDate = formatDistanceToNowStrict(value, {
    addSuffix: true,
  });
  if (relativeDate.includes("seconds")) return "Just now";
  return relativeDate;
}
