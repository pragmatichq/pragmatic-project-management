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

    const stakeholders = await asyncMap(
      await getManyFrom(ctx.db, "actionStakeholders", "by_action", action._id),
      async (stakeholder) => {
        const user = await ctx.db.get(stakeholder.user);
        return user?.clerkId; // Return only the clerkId from each user object
      }
    );

    return stakeholders;
  },
});

export const create = mutationWithOrganization({
  args: {
    actionId: v.id("actions"),
    memberClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const action = await ctx.db.get(args.actionId);

    if (!action) {
      throw new ConvexError("Task not found");
    }

    if (action?.organization !== ctx.orgId) {
      throw new ConvexError("Unauthorized");
    }

    const stakeholder = await ctx.db
      .query("users")
      .filter((q) => q.or(q.eq(q.field("clerkId"), args.memberClerkId)))
      .unique();

    if (!stakeholder) {
      throw new ConvexError("User not found");
    }

    await ctx.db.insert("actionStakeholders", {
      user: stakeholder._id,
      organization: ctx.orgId,
      action: action._id,
      waiting_on: false,
    });

    await ctx.db.patch(args.actionId, {
      last_updated: new Date().toISOString(),
    });
  },
});

export const remove = mutationWithOrganizationUser({
  args: { actionId: v.id("actions"), memberClerkId: v.string() },
  handler: async (ctx, args) => {
    const stakeholder = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.memberClerkId))
      .unique();

    const existingStakeholder = await ctx.db
      .query("actionStakeholders")
      .filter((q) =>
        q.and(
          q.eq(q.field("user"), stakeholder?._id),
          q.eq(q.field("action"), args.actionId)
        )
      )
      .unique();

    if (!existingStakeholder) {
      throw new ConvexError("Not found");
    }

    if (existingStakeholder.organization !== ctx.orgId) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.delete(existingStakeholder._id);
    await ctx.db.patch(args.actionId, {
      last_updated: new Date().toISOString(),
    });
  },
});
