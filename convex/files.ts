import { v } from "convex/values";
import { asyncMap } from "convex-helpers";
import {
  mutationWithOrganization,
  queryWithOrganization,
} from "./customFunctions";

export const list = queryWithOrganization({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .withIndex("by_action")
      .filter((q) =>
        q.and(
          q.eq(q.field("organization"), ctx.orgId),
          q.eq(q.field("action"), args.actionId)
        )
      )
      .collect();

    files.reverse();

    const storageIds = files.map((file) => file.storageId);

    const metadata = await asyncMap(storageIds, ctx.db.system.get);

    return Promise.all(
      files.map(async (file) => ({
        url: await ctx.storage.getUrl(file.storageId),
        metadata: metadata.find((m) => m?._id === file.storageId),
        ...file,
      }))
    );
  },
});

export const generateUploadUrl = mutationWithOrganization({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveStorageId = mutationWithOrganization({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    actionId: v.id("actions"),
  },
  handler: async (ctx, args) => {
    ctx.db.insert("files", {
      storageId: args.storageId,
      organization: ctx.orgId,
      filename: args.filename,
      action: args.actionId,
    });

    await ctx.db.patch(args.actionId, {
      last_updated: new Date().toISOString(),
    });
  },
});
