import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getOneFromOrThrow } from "convex-helpers/server/relationships";

export const list = query({
  args: {
    parent: v.id("tasks"),
  },
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

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_organization_parent", (q) =>
        q.eq("organization", organization._id).eq("parent", args.parent)
      )
      .take(100);

    for (let comment of comments) {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), comment.author))
        .unique();

      if (user) {
        (comment as any).authorClerkId = user.clerkId as string;
      }
    }
    return comments;
  },
});

export const create = mutation({
  args: {
    parent: v.id("tasks"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getOneFromOrThrow(
      ctx.db,
      "users",
      "by_clerkId",
      identity.subject
    );

    // This is hacked together because Convex only allows standard claims
    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      identity.language
    );

    await ctx.db.insert("comments", {
      organization: organization._id,
      parent: args.parent,
      text: args.text,
      author: user._id,
    });
  },
});
