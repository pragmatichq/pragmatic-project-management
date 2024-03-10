import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = identity.language!;

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_title")
      .filter((q) => q.eq(q.field("organization"), organization))
      .take(100);
    return projects;
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = identity.language;

    const existingProject = await ctx.db.get(args.id);

    if (!existingProject) {
      throw new Error("Not found");
    }

    if (existingProject.organization !== organization) {
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
    const organization = identity.language!;

    await ctx.db.insert("projects", {
      title: args.title,
      description: args.description,
      organization: organization,
      requester: [userId],
      status: "Triage",
    });
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = identity.language;

    const existingProject = await ctx.db.get(args.id);

    if (!existingProject) {
      throw new Error("Not found");
    }

    if (existingProject.organization !== organization) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    status: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = identity.language;

    const { id, ...rest } = args;

    const existingProject = await ctx.db.get(args.id);

    if (!existingProject) {
      throw new Error("Not found");
    }

    if (existingProject.organization !== organization) {
      throw new Error("Unauthorized");
    }

    const project = await ctx.db.patch(args.id, {
      ...rest,
    });

    return project;
  },
});
