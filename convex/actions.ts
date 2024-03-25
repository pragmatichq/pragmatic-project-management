import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  getOneFromOrThrow,
  getManyVia,
} from "convex-helpers/server/relationships.js";
import { queryWithOrganization } from "./custom-fuctions";

export const list = queryWithOrganization({
  args: {},
  handler: async (ctx) => {
    const actions = await ctx.db
      .query("actions")
      .withIndex("by_organization")
      .filter((q) => q.eq(q.field("organization"), ctx.orgId))
      .collect();

    for (let action of actions) {
      const actionAssignees = await getManyVia(
        ctx.db,
        "actionAssignees",
        "user",
        "by_action",
        action._id,
        "action"
      );

      const assignees = [];
      for (let actionAssignee of actionAssignees) {
        assignees.push(actionAssignee?.clerkId);
      }

      (action as any).assignees = assignees;
    }

    return actions;
  },
});

export const get = query({
  args: { actionId: v.id("actions") },
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

    const existingAction = await ctx.db.get(args.actionId);

    if (!existingAction) {
      throw new Error("Not found");
    }

    if (existingAction.organization !== organization._id) {
      throw new Error("Unauthorized");
    }

    const actionAssignees = await getManyVia(
      ctx.db,
      "actionAssignees",
      "user",
      "by_action",
      existingAction._id
    );

    const assignees = [];
    for (let actionAssignee of actionAssignees) {
      assignees.push(actionAssignee?.clerkId);
    }

    (existingAction as any).assignees = assignees;

    return existingAction;
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
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

    await ctx.db.insert("actions", {
      title: args.title,
      organization: organization._id,
      last_updated: new Date().toISOString(),
      status: "Triage",
      is_archived: false,
    });
  },
});

export const remove = mutation({
  args: { actionId: v.id("actions") },
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

    const existingProject = await ctx.db.get(args.actionId);

    if (!existingProject) {
      throw new Error("Not found");
    }

    if (existingProject.organization !== organization._id) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.actionId);
  },
});

export const update = mutation({
  args: {
    actionId: v.id("actions"),
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

    const { actionId, ...rest } = args;

    const existingAction = await ctx.db.get(args.actionId);

    if (!existingAction) {
      throw new Error("Not found");
    }

    if (existingAction.organization !== organization._id) {
      throw new Error("Unauthorized");
    }

    const task = await ctx.db.patch(args.actionId, {
      last_updated: new Date().toISOString(),
      ...rest,
    });

    return task;
  },
});
