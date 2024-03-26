import {
  mutationWithOrganization,
  mutationWithOrganizationUser,
  queryWithOrganization,
} from "./customFunctions";
import { ConvexError, v } from "convex/values";
import { getManyFrom } from "convex-helpers/server/relationships.js";
import { asyncMap } from "convex-helpers";

export const getByTask = queryWithOrganization({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    const action = await ctx.db.get(args.actionId);

    if (!action) {
      throw new ConvexError("Task not found");
    }

    if (action?.organization !== ctx.orgId) {
      throw new ConvexError("Unauthorized");
    }

    const assignees = await asyncMap(
      await getManyFrom(ctx.db, "actionAssignees", "by_action", action._id),
      async (assignee) => {
        const user = await ctx.db.get(assignee.user);
        return user?.clerkId; // Return only the clerkId from each user object
      }
    );

    return assignees;
  },
});

export const create = mutationWithOrganization({
  args: {
    actionId: v.id("actions"),
    userClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const action = await ctx.db.get(args.actionId);

    if (!action) {
      throw new ConvexError("Task not found");
    }

    if (action?.organization !== ctx.orgId) {
      throw new ConvexError("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.or(q.eq(q.field("clerkId"), args.userClerkId)))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.insert("actionAssignees", {
      user: user._id,
      organization: ctx.orgId,
      action: action._id,
    });

    await ctx.db.patch(args.actionId, {
      last_updated: new Date().toISOString(),
    });
  },
});

export const remove = mutationWithOrganizationUser({
  args: { actionId: v.id("actions"), userClerkId: v.string() },
  handler: async (ctx, args) => {
    const existingAssignee = await ctx.db
      .query("actionAssignees")
      .filter((q) =>
        q.and(
          q.eq(q.field("user"), ctx.userId),
          q.eq(q.field("action"), args.actionId)
        )
      )
      .unique();

    if (!existingAssignee) {
      throw new ConvexError("Not found");
    }

    if (existingAssignee.organization !== ctx.orgId) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.delete(existingAssignee._id);
    await ctx.db.patch(args.actionId, {
      last_updated: new Date().toISOString(),
    });
  },
});
