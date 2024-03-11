import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { getOneFromOrThrow } from "convex-helpers/server/relationships.js";

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
      .take(100);
    return tasks;
  },
});

export const get = query({
  args: { id: v.id("tasks") },
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

    const existingProject = await ctx.db.get(args.id);

    if (!existingProject) {
      throw new Error("Not found");
    }

    if (existingProject.organization !== organization._id) {
      throw new Error("Unauthorized");
    }

    return existingProject;
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
    status: v.optional(v.string()),
    due_date: v.optional(v.string()),
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

    const existingProject = await ctx.db.get(args.id);

    if (!existingProject) {
      throw new Error("Not found");
    }

    if (existingProject.organization !== organization._id) {
      throw new Error("Unauthorized");
    }

    const project = await ctx.db.patch(args.id, {
      ...rest,
    });

    return project;
  },
});
