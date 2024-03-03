import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

import { getAll } from "convex-helpers/server/relationships";

export const list = query({
  args: { project: v.optional(v.id("projects")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = identity.language!;

    if (args.project) {
      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_organization_project", (q) =>
          q.eq("organization", organization).eq("project", args.project!)
        )
        .take(100);
      const project = await ctx.db.get(args.project);
      const tasksWithProjects = tasks.map((task) => ({
        ...task,
        projectDetails: project,
      }));
      return tasksWithProjects;
    } else {
      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_organization_project", (q) =>
          q.eq("organization", organization)
        )
        .take(100);
      const projectIds: Iterable<any> = tasks.map((task) => task.project);
      const projects = await getAll(ctx.db, projectIds);
      const tasksWithProjects = tasks.map((task) => ({
        ...task,
        projectDetails: projects.find(
          (project) => project?._id == task.project
        ),
      }));
      return tasksWithProjects;
    }
  },
});

export const getById = query({
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

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    status: v.optional(v.string()),
    flags: v.optional(v.array(v.string())),
    assignees: v.optional(v.array(v.string())),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = identity.language;

    const { id, ...rest } = args;

    const existingTask = await ctx.db.get(args.id);

    if (!existingTask) {
      throw new Error("Not found");
    }

    if (existingTask.organization !== organization) {
      throw new Error("Unauthorized");
    }

    const task = await ctx.db.patch(args.id, {
      ...rest,
    });

    return task;
  },
});
