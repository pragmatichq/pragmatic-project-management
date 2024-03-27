import { ConvexError, v } from "convex/values";
import { getManyVia } from "convex-helpers/server/relationships.js";
import {
  queryWithOrganization,
  mutationWithOrganization,
} from "./customFunctions";

export const list = queryWithOrganization({
  args: { statuses: v.array(v.string()), timeFrames: v.array(v.string()) },
  handler: async (ctx, args) => {
    let filteredActions = await ctx.db
      .query("actions")
      .withIndex("by_organization")
      .filter((q) => q.eq(q.field("organization"), ctx.orgId));

    if (args.statuses && args.statuses.length > 0) {
      filteredActions = filteredActions.filter((q) =>
        q.or(...args.statuses!.map((c) => q.eq(q.field("status"), c)))
      );
    }

    if (args.timeFrames && args.timeFrames.length > 0) {
      filteredActions = filteredActions.filter((q) =>
        q.or(...args.timeFrames!.map((c) => q.eq(q.field("time_frame"), c)))
      );
    }

    const actions = await filteredActions.collect();

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

export const get = queryWithOrganization({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    const existingAction = await ctx.db.get(args.actionId);

    if (!existingAction) {
      throw new ConvexError("Not found");
    }

    if (existingAction.organization !== ctx.orgId) {
      throw new ConvexError("Unauthorized organization");
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

export const create = mutationWithOrganization({
  args: {
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("actions", {
      title: args.title,
      organization: ctx.orgId,
      last_updated: new Date().toISOString(),
      status: "Triage",
      is_archived: false,
    });
  },
});

export const remove = mutationWithOrganization({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    const existingProject = await ctx.db.get(args.actionId);

    if (!existingProject) {
      throw new ConvexError("Action not found");
    }

    if (existingProject.organization !== ctx.orgId) {
      throw new ConvexError("Action belongs to different organization");
    }

    await ctx.db.delete(args.actionId);
  },
});

export const update = mutationWithOrganization({
  args: {
    actionId: v.id("actions"),
    title: v.optional(v.string()),
    status: v.optional(v.string()),
    due_date: v.optional(v.string()),
    flags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const { actionId, ...rest } = args;

    const existingAction = await ctx.db.get(args.actionId);

    if (!existingAction) {
      throw new ConvexError("Action not found");
    }

    if (existingAction.organization !== ctx.orgId) {
      throw new ConvexError("Action belongs to other organization");
    }

    const task = await ctx.db.patch(args.actionId, {
      last_updated: new Date().toISOString(),
      ...rest,
    });

    return task;
  },
});
