import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUser: v.any(),
    clerkId: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),
  organizations: defineTable({
    clerkOrganization: v.any(),
    clerkId: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),
  projects: defineTable({
    title: v.string(),
  }),
  tasks: defineTable({
    title: v.string(),
    organization: v.id("organizations"),
    last_updated: v.string(),
    status: v.string(),
    project: v.optional(v.id("projects")),
    description: v.optional(v.string()),
    time_frame: v.optional(v.string()),
    flags: v.optional(v.array(v.string())),
    due_date: v.optional(v.string()),
    is_archived: v.boolean(),
  }).index("by_organization", ["organization"]),
  comments: defineTable({
    parent: v.id("tasks"),
    organization: v.id("organizations"),
    text: v.string(),
    author: v.id("users"),
  }).index("by_organization_parent", ["organization", "parent"]),
  taskAssignees: defineTable({
    organization: v.id("organizations"),
    task: v.id("tasks"),
    user: v.id("users"),
  }).index("by_task", ["task"]),
  taskRequesters: defineTable({
    organization: v.id("organizations"),
    task: v.id("tasks"),
    user: v.id("users"),
  }).index("by_organization_task", ["organization", "task"]),
});
