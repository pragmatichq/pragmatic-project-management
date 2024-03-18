import { v } from "convex/values";
import { mutation } from "./_generated/server";
import {
  getOneFromOrThrow,
  getAll,
  getManyFrom,
} from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";
import { query } from "./_generated/server";

export const list = query({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      identity.language
    );

    const files = await ctx.db
      .query("files")
      .withIndex("by_action")
      .filter((q) =>
        q.and(
          q.eq(q.field("organization"), organization._id),
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

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      identity.language
    );

    return await ctx.storage.generateUploadUrl();
  },
});

export const saveStorageId = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    actionId: v.id("actions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // This is hacked together because Convex only allows standard claims
    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      identity.language
    );

    ctx.db.insert("files", {
      storageId: args.storageId,
      organization: organization._id,
      filename: args.filename,
      action: args.actionId,
    });

    await ctx.db.patch(args.actionId, {
      last_updated: new Date().toISOString(),
    });
  },
});
