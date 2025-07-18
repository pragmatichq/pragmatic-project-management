import { ConvexError, v } from "convex/values";
import {
  queryWithOrganization,
  mutationWithOrganization,
} from "./customFunctions";

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

export const get = queryWithOrganization({
  args: {
    broadcastId: v.id("broadcasts"),
  },
  handler: async (ctx, args) => {
    let broadcast = ctx.db.get(args.broadcastId);

    return broadcast;
  },
});

export const create = mutationWithOrganization({
  args: {},
  handler: async (ctx) => {
    const broadcast = await ctx.db.insert("broadcasts", {
      organization: ctx.orgId,
      publish_date: new Date().toISOString(),
      status: "draft",
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
    content: v.optional(v.string()),
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

    const updates: { [key: string]: any } = Object.entries(rest).reduce(
      (acc: any, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    // Use the updates object to only send provided arguments
    const broadcast = await ctx.db.patch(broadcastId, updates);
    return broadcast;
  },
});
