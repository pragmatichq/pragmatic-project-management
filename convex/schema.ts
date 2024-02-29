import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUser: v.any(),
    clerkId: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkUser.id"]),
  organizations: defineTable({
    clerkOrganization: v.any(),
    clerkId: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
  projects: defineTable({
    title: v.string(),
    organization: v.string(),
    status: v.string(),
  }).index("by_title", ["title"]),
  tasks: defineTable({
    title: v.string(),
    project: v.string(),
    organization: v.string(),
    status: v.string(),
    flags: v.optional(v.array(v.string())),
    assignees: v.optional(v.array(v.string())),
    dueDate: v.optional(v.string()),
  })
    .index("by_organization_project", ["organization", "project"])
    .index("by_organization", ["organization"]),
  discussions: defineTable({
    title: v.string(),
    date: v.string(),
    organization: v.string(),
    project: v.string(),
    author: v.string(),
  }).index("by_project", ["project"]),
  comments: defineTable({
    author: v.string(),
    organization: v.string(),
    text: v.string(),
    parent: v.union(v.id("tasks"), v.id("discussions")),
  }).index("by_organization_parent", ["organization", "parent"]),
});
