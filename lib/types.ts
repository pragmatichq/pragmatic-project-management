import { Doc } from "@/convex/_generated/dataModel";

export interface ActionWithMembers extends Doc<"actions"> {
  assignees: string[];
  stakeholders: string[];
}
