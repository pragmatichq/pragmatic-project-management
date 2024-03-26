import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { Auth } from "convex/server";
import { getOneFromOrThrow } from "convex-helpers/server/relationships.js";

export const queryWithOrganization = customQuery(
  query,
  customCtx(async (ctx) => {
    const { clerkUserId, clerkOrganizationId } = await getUserInfo(ctx);
    if (clerkUserId === undefined) {
      throw new ConvexError("Not authenticated");
    }
    if (clerkOrganizationId === undefined) {
      throw new ConvexError("No active organization");
    }

    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      clerkOrganizationId,
      "clerkId"
    );

    const orgId = organization._id;

    return { orgId };
  })
);

export const mutationWithOrganization = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const { clerkUserId, clerkOrganizationId } = await getUserInfo(ctx);
    if (clerkUserId === undefined) {
      throw new ConvexError("Not authenticated");
    }
    if (clerkOrganizationId === undefined) {
      throw new ConvexError("No active organization");
    }

    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      clerkOrganizationId,
      "clerkId"
    );
    const orgId = organization._id;

    return { orgId };
  })
);

export const mutationWithOrganizationUser = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const { clerkUserId, clerkOrganizationId } = await getUserInfo(ctx);
    if (clerkUserId === undefined) {
      throw new ConvexError("Not authenticated");
    }
    if (clerkOrganizationId === undefined) {
      throw new ConvexError("No active organization");
    }

    const user = await getOneFromOrThrow(
      ctx.db,
      "users",
      "by_clerkId",
      clerkUserId
    );

    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      clerkOrganizationId,
      "clerkId"
    );

    const userId = user._id;
    const orgId = organization._id;

    return { orgId, userId };
  })
);

async function getUserInfo(ctx: { auth: Auth }) {
  const authInfo = await ctx.auth.getUserIdentity();
  return {
    clerkUserId: authInfo?.subject,
    clerkOrganizationId: authInfo?.language,
  };
}
