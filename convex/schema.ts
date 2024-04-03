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
  actions: defineTable({
    organization: v.id("organizations"),
    last_updated: v.string(),
    status: v.string(),
    is_archived: v.boolean(),
    title: v.optional(v.string()),
    initiative: v.optional(v.id("initiatives")),
    description: v.optional(
      v.object({ type: v.string(), content: v.array(v.any()) })
    ),
    time_frame: v.optional(v.string()),
    flags: v.optional(v.array(v.string())),
    due_date: v.optional(v.string()),
    created_by: v.optional(v.id("users")),
  }).index("by_organization", ["organization"]),
  actionAssignees: defineTable({
    organization: v.id("organizations"),
    action: v.id("actions"),
    user: v.id("users"),
  }).index("by_action", ["action"]),
  actionStakeholders: defineTable({
    organization: v.id("organizations"),
    action: v.id("actions"),
    user: v.id("users"),
    waiting_on: v.boolean(),
  }).index("by_action", ["action"]),
  initiatives: defineTable({
    title: v.string(),
    organization: v.id("organizations"),
    created_by: v.optional(v.id("users")),
  }),
  comments: defineTable({
    organization: v.id("organizations"),
    parent: v.id("actions"),
    content: v.string(),
    author: v.id("users"),
  }).index("by_organization_parent", ["organization", "parent"]),
  files: defineTable({
    organization: v.id("organizations"),
    storageId: v.id("_storage"),
    filename: v.string(),
    action: v.id("actions"),
    created_by: v.optional(v.id("users")),
  })
    .index("by_action", ["action"])
    .index("by_organization", ["organization"]),
  broadcasts: defineTable({
    organization: v.id("organizations"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    publish_date: v.optional(v.string()),
    status: v.string(),
    created_by: v.optional(v.id("users")),
  }).index("by_organization_publish_date", ["organization", "publish_date"]),
});
