import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

import { getAll } from "convex-helpers/server/relationships";

export const getTasksByProject = query({
  args: { organization: v.string(), project: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_organization_project", (q) =>
        q.eq("organization", args.organization).eq("project", args.project)
      )
      .take(100);
    return tasks;
  },
});

export const getTask = query({
  args: { organization: v.string(), _id: v.string() },
  handler: async (ctx, args) => {
    const task = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("organization"), args.organization))
      .filter((q) => q.eq(q.field("_id"), args._id))
      .unique();
    return task;
  },
});

export const getTasksByOrganization = query({
  args: { organization: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_organization", (q) =>
        q.eq("organization", args.organization)
      )
      .take(100);
    const projectIds: Iterable<any> = tasks.map((task) => task.project);
    const projects = await getAll(ctx.db, projectIds);
    const tasksWithProjects = tasks.map((task) => ({
      ...task,
      projectDetails: projects.find((project) => project?._id == task.project),
    }));
    return tasksWithProjects;
  },
});

export const updateTaskAssignees = mutation({
  args: { id: v.id("tasks"), assignees: v.array(v.string()) },
  handler: async (ctx, args) => {
    const { id, assignees } = args;
    await ctx.db.patch(id, { assignees: assignees });
  },
});

export const updateTaskDueDate = mutation({
  args: { id: v.id("tasks"), dueDate: v.string() },
  handler: async (ctx, args) => {
    const { id, dueDate } = args;
    await ctx.db.patch(id, { dueDate: dueDate });
  },
});

export const updateTaskStatus = mutation({
  args: { id: v.id("tasks"), status: v.string() },
  handler: async (ctx, args) => {
    const { id, status } = args;
    await ctx.db.patch(id, { status: status });
  },
});
