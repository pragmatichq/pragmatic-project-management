import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUser: v.any(),
    clerkId: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
  organizations: defineTable({
    clerkOrganization: v.any(),
    clerkId: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
  projects: defineTable({
    title: v.string(),
    organization: v.string(),
    last_updated: v.string(),
    status: v.string(),
    parent: v.optional(v.id("projects")),
    description: v.optional(v.string()),
    time_frame: v.optional(v.string()),
    flags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.string()),
  }).index("by_organization", ["organization"]),
  assignees: defineTable({
    organization: v.string(),
    project: v.id("projects"),
    user: v.id("users"),
  }).index("by_organization", ["organization"]),
  requesters: defineTable({
    organization: v.string(),
    project: v.id("projects"),
    user: v.id("users"),
  }).index("by_organization", ["organization"]),
});
