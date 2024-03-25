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
      console.log("User Id", clerkUserId);
      return null;
    }

    console.log("User Id", clerkUserId);
    console.log("Org Id", clerkOrganizationId);
    if (clerkOrganizationId === undefined) {
      console.log("Org Id", clerkOrganizationId);
      return null;
    }

    const organization = await getOneFromOrThrow(
      ctx.db,
      "organizations",
      "by_clerkId",
      clerkOrganizationId,
      "clerkId"
    );
    console.log(organization._id);
    const orgId = organization._id;

    return { orgId, clerkUserId };
  })
);

async function getUserInfo(ctx: { auth: Auth }) {
  const authInfo = await ctx.auth.getUserIdentity();
  return {
    clerkUserId: authInfo?.subject,
    clerkOrganizationId: authInfo?.language,
  };
}
