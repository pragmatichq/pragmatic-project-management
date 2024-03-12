import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  getOneFromOrThrow,
  getManyFrom,
} from "convex-helpers/server/relationships.js";
import { asyncMap } from "convex-helpers";

export const getByTask = query({
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

    const task = await ctx.db.get(args.taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    if (task?.organization !== organization._id) {
      throw new Error("Unauthorized");
    }

    const assignees = await asyncMap(
      await getManyFrom(ctx.db, "taskAssignees", "by_task", task._id),
      async (assignee) => {
        const user = await ctx.db.get(assignee.user);
        return user?.clerkId; // Return only the clerkId from each user object
      }
    );

    return assignees;
  },
});

export const create = mutation({
  args: {
    taskId: v.id("tasks"),
    userClerkId: v.string(),
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

    const task = await ctx.db.get(args.taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    if (task?.organization !== organization._id) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.or(q.eq(q.field("clerkId"), args.userClerkId)))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.insert("taskAssignees", {
      user: user._id,
      organization: organization._id,
      task: task._id,
    });

    await ctx.db.patch(args.taskId, {
      last_updated: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: { taskId: v.id("tasks"), userClerkId: v.string() },
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

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.userClerkId))
      .unique();

    const existingAssignee = await ctx.db
      .query("taskAssignees")
      .filter((q) =>
        q.and(
          q.eq(q.field("user"), user?._id),
          q.eq(q.field("task"), args.taskId)
        )
      )
      .unique();

    console.log(existingAssignee?.organization, organization._id);

    if (!existingAssignee) {
      throw new Error("Not found");
    }

    if (existingAssignee.organization !== organization._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(existingAssignee._id);
    await ctx.db.patch(args.taskId, {
      last_updated: new Date().toISOString(),
    });
  },
});
