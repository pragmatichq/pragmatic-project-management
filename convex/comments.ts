import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCommentsByParent = query({
  args: {
    organization: v.string(),
    parent: v.union(v.id("tasks"), v.id("discussions")),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_organization_parent", (q) =>
        q.eq("organization", args.organization).eq("parent", args.parent)
      )
      .take(100);
    return comments;
  },
});

export const createComment = mutation({
  args: {
    organization: v.string(),
    parent: v.union(v.id("tasks"), v.id("discussions")),
    text: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", {
      organization: args.organization,
      parent: args.parent,
      text: args.text,
      author: args.author,
    });
  },
});
