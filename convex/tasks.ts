import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  getOneFromOrThrow,
  getManyVia,
} from "convex-helpers/server/relationships.js";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      identity.language
    );

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_organization")
      .filter((q) => q.eq(q.field("organization"), organization._id))
      .collect();

    for (let task of tasks) {
      const taskAssignees = await getManyVia(
        ctx.db,
        "taskAssignees",
        "user",
        "by_task",
        task._id
      );

      const assignees = [];
      for (let taskAssignee of taskAssignees) {
        assignees.push(taskAssignee?.clerkId);
      }

      (task as any).assignees = assignees;
    }

    return tasks;
  },
});

export const get = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      identity.language
    );

    const existingTask = await ctx.db.get(args.taskId);

    if (!existingTask) {
      throw new Error("Not found");
    }

    if (existingTask.organization !== organization._id) {
      throw new Error("Unauthorized");
    }

    const taskAssignees = await getManyVia(
      ctx.db,
      "taskAssignees",
      "user",
      "by_task",
      existingTask._id
    );

    const assignees = [];
    for (let taskAssignee of taskAssignees) {
      assignees.push(taskAssignee?.clerkId);
    }

    (existingTask as any).assignees = assignees;

    return existingTask;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // This is hacked together because Convex only allows standard claims
    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      identity.language
    );

    await ctx.db.insert("tasks", {
      title: args.title,
      organization: organization._id,
      last_updated: new Date().toISOString(),
      status: "Triage",
      is_archived: false,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      identity.language
    );

    const existingProject = await ctx.db.get(args.id);

    if (!existingProject) {
      throw new Error("Not found");
    }

    if (existingProject.organization !== organization._id) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    status: v.optional(v.string()),
    due_date: v.optional(v.string()),
    flags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      identity.language
    );

    const { id, ...rest } = args;

    const existingTask = await ctx.db.get(args.id);

    if (!existingTask) {
      throw new Error("Not found");
    }

    if (existingTask.organization !== organization._id) {
      throw new Error("Unauthorized");
    }

    const task = await ctx.db.patch(args.id, {
      last_updated: new Date().toISOString(),
      ...rest,
    });

    return task;
  },
});
