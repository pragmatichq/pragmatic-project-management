import { ConvexError, v } from "convex/values";
import {
  queryWithOrganization,
  mutationWithOrganizationUser,
} from "./customFunctions";

var sanitizeHtml = require("sanitize-html");

export const list = queryWithOrganization({
  args: {
    parent: v.id("actions"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_organization_parent", (q) =>
        q.eq("organization", ctx.orgId).eq("parent", args.parent)
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

export const create = mutationWithOrganizationUser({
  args: {
    parent: v.id("actions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanedContent = sanitizeHtml(args.content);

    await ctx.db.insert("comments", {
      organization: ctx.orgId,
      parent: args.parent,
      content: cleanedContent,
      author: ctx.userId,
    });

    await ctx.db.patch(args.parent, {
      last_updated: new Date().toISOString(),
    });
  },
});
