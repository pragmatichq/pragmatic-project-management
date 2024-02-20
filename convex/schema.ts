import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // this is UserJSON from @clerk/backend
    clerkUser: v.any(),
  }).index("by_clerk_id", ["clerkUser.id"]),
  organizations: defineTable({
    // this is UserJSON from @clerk/backend
    clerkOrganization: v.any(),
  }).index("by_clerk_id", ["clerkOrganization.id"]),
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
  }).index("by_project", ["project"]),
});
