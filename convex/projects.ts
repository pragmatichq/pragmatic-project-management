import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const getProjectList = query({
  args: { organization: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("organization"), args.organization))
      .order("desc")
      .take(100);
    return projects;
  },
});

export const getProject = query({
  args: { organization: v.string(), _id: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("organization"), args.organization))
      .filter((q) => q.eq(q.field("_id"), args._id))
      .unique();
    return projects;
  },
});

export const createProject = mutation({
  args: {
    title: v.string(),
    is_completed: v.boolean(),
    organization: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("projects", {
      title: args.title,
      is_completed: args.is_completed,
      organization: args.organization,
      category: args.category,
    });
  },
});

export const deleteProject = mutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const projectRecord = await projectQuery(ctx, id);

    if (projectRecord === null) {
      console.warn("can't delete project, does not exist", id);
    } else {
      await ctx.db.delete(projectRecord._id);
    }
  },
});

export async function projectQuery(ctx: QueryCtx, projectId: string) {
  return await ctx.db
    .query("projects")
    .filter((q) => q.eq(q.field("_id"), projectId))
    .unique();
}
