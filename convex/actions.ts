import { ConvexError, v } from "convex/values";
import { getManyVia } from "convex-helpers/server/relationships.js";
import {
  queryWithOrganization,
  mutationWithOrganization,
} from "./customFunctions";

export const list = queryWithOrganization({
  args: {
    statuses: v.optional(v.array(v.string())),
    timeFrames: v.optional(v.array(v.string())),
    assignees: v.optional(v.array(v.string())),
    flags: v.optional(v.array(v.string())),
  },
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

    let actions = await filteredActions.collect();

    if (args.flags && args.flags.length > 0) {
      actions = actions.filter((action: any) => {
        if (action.flags) {
          return action.flags.some((flag: any) => args.flags!.includes(flag));
        }
        return false;
      });
    }

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

      const actionStakeholders = await getManyVia(
        ctx.db,
        "actionStakeholders",
        "user",
        "by_action",
        action._id,
        "action"
      );

      const stakeholders = [];
      for (let actionStakeholder of actionStakeholders) {
        stakeholders.push(actionStakeholder?.clerkId);
      }

      (action as any).stakeholders = stakeholders;
    }

    if (args.assignees && args.assignees.length > 0) {
      actions = actions.filter((action: any) =>
        action.assignees.some((assignee: any) =>
          args.assignees!.includes(assignee)
        )
      );
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

    const actionStakeholders = await getManyVia(
      ctx.db,
      "actionStakeholders",
      "user",
      "by_action",
      existingAction._id,
      "action"
    );

    const stakeholders = [];
    for (let actionStakeholder of actionStakeholders) {
      stakeholders.push(actionStakeholder?.clerkId);
    }

    (existingAction as any).stakeholders = stakeholders;

    return existingAction;
  },
});

export const create = mutationWithOrganization({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const action = await ctx.db.insert("actions", {
      title: args.title,
      organization: ctx.orgId,
      last_updated: new Date().toISOString(),
      due_date: "",
      time_frame: "",
      status: "Triage",
      is_archived: false,
    });
    return action;
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
    description: v.optional(
      v.object({ type: v.string(), content: v.array(v.any()) })
    ),
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
