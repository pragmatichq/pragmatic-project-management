import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const getTasksByProject = query({
  args: { organization: v.string(), project: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project")
      .filter((q) => q.eq(q.field("organization"), args.organization))
      .filter((q) => q.eq(q.field("project"), args.project))
      .take(100);
    return tasks;
  },
});
