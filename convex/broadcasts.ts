import { ConvexError, v } from "convex/values";
import { getManyVia } from "convex-helpers/server/relationships.js";
import {
  queryWithOrganization,
  mutationWithOrganization,
} from "./customFunctions";
import { Id } from "./_generated/dataModel";

export const list = queryWithOrganization({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let filteredBroadcasts = await ctx.db
      .query("broadcasts")
      .withIndex("by_organization_publish_date")
      .filter((q) => q.eq(q.field("organization"), ctx.orgId));

    if (args.status) {
      filteredBroadcasts = filteredBroadcasts.filter((q) =>
        q.or(q.eq(q.field("status"), args.status))
      );
    }

    let broadcasts = await filteredBroadcasts.collect();

    return broadcasts;
  },
});

export const create = mutationWithOrganization({
  args: {},
  handler: async (ctx) => {
    const broadcast = await ctx.db.insert("broadcasts", {
      organization: ctx.orgId,
      publish_date: new Date().toISOString(),
      status: "Draft",
      // @ts-ignore
      created_by: ctx.userId,
    });
    return broadcast;
  },
});

export const remove = mutationWithOrganization({
  args: { broadcastId: v.id("broadcasts") },
  handler: async (ctx, args) => {
    const existingBroadcast = await ctx.db.get(args.broadcastId);

    if (!existingBroadcast) {
      throw new ConvexError("Action not found");
    }

    if (existingBroadcast.organization !== ctx.orgId) {
      throw new ConvexError("Action belongs to different organization");
    }

    await ctx.db.delete(args.broadcastId);
  },
});

export const update = mutationWithOrganization({
  args: {
    broadcastId: v.id("broadcasts"),
    title: v.optional(v.string()),
    status: v.optional(v.string()),
    publish_date: v.optional(v.string()),
    content: v.optional(
      v.object({ type: v.string(), content: v.array(v.any()) })
    ),
  },

  handler: async (ctx, args) => {
    const { broadcastId, ...rest } = args;

    const existingBroadcast = await ctx.db.get(args.broadcastId);

    if (!existingBroadcast) {
      throw new ConvexError("Action not found");
    }

    if (existingBroadcast.organization !== ctx.orgId) {
      throw new ConvexError("Action belongs to other organization");
    }

    const task = await ctx.db.patch(args.broadcastId, {
      ...rest,
    });
    return task;
  },
});
