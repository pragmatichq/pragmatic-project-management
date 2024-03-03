import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    parent: v.union(v.id("tasks"), v.id("discussions")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = identity.language!;
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_organization_parent", (q) =>
        q.eq("organization", organization).eq("parent", args.parent)
      )
      .take(100);
    return comments;
  },
});

export const create = mutation({
  args: {
    parent: v.union(v.id("tasks"), v.id("discussions")),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const userId = identity.subject;
    const organization = identity.language!;

    await ctx.db.insert("comments", {
      organization: organization,
      parent: args.parent,
      text: args.text,
      author: userId,
    });
  },
});
