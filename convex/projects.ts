import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const getProjectList = query({
  args: { organization: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_title")
      .filter((q) => q.eq(q.field("organization"), args.organization))
      .take(100);
    return projects;
  },
});

export const getProject = query({
  args: { organization: v.string(), _id: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("organization"), args.organization))
      .filter((q) => q.eq(q.field("_id"), args._id))
      .unique();
    return projects;
  },
});

export const createProject = mutation({
  args: {
    title: v.string(),
    organization: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("projects", {
      title: args.title,
      organization: args.organization,
      status: "In Progress",
    });
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateProjectStatus = mutation({
  args: { id: v.id("projects"), status: v.string() },
  handler: async (ctx, args) => {
    const { id, status } = args;
    await ctx.db.patch(id, { status: status });
  },
});
