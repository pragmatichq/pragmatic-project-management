import {
  internalMutation,
  internalQuery,
  query,
  QueryCtx,
} from "./_generated/server";

import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { OrganizationJSON } from "@clerk/backend";

/** Get Organization by Clerk use id (AKA "subject" on auth)  */
export const getOrganization = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await organizationQuery(ctx, args.subject);
  },
});

/** Create a new Clerk Organization or update existing Clerk Organization data. */
export const updateOrCreateOrganization = internalMutation({
  args: { clerkOrganization: v.any() }, // no runtime validation, trust Clerk
  async handler(
    ctx,
    { clerkOrganization }: { clerkOrganization: OrganizationJSON }
  ) {
    const organizationRecord = await organizationQuery(
      ctx,
      clerkOrganization.id
    );

    if (organizationRecord === null) {
      await ctx.db.insert("organizations", { clerkOrganization });
    } else {
      await ctx.db.patch(organizationRecord._id, { clerkOrganization });
    }
  },
});

/** Delete a Organization by clerk Organization ID. */
export const deleteOrganization = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const organizationRecord = await organizationQuery(ctx, id);

    if (organizationRecord === null) {
      console.warn("can't delete Organization, does not exist", id);
    } else {
      await ctx.db.delete(organizationRecord._id);
    }
  },
});

// Helpers

export async function organizationQuery(
  ctx: QueryCtx,
  clerkOrganizationId: string
): Promise<
  | (Omit<Doc<"organizations">, "clerkOrganization"> & {
      clerkOrganization: OrganizationJSON;
    })
  | null
> {
  return await ctx.db
    .query("organizations")
    .withIndex("by_clerk_id", (q) =>
      q.eq("clerkOrganization.id", clerkOrganizationId)
    )
    .unique();
}

export async function organizationById(
  ctx: QueryCtx,
  id: Id<"organizations">
): Promise<
  | (Omit<Doc<"organizations">, "clerkOrganization"> & {
      clerkOrganization: OrganizationJSON;
    })
  | null
> {
  return await ctx.db.get(id);
}
