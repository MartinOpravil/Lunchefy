import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const getRecipeById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const recipeBook = await ctx.db
      .query("recipeBooks")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();

    if (!recipeBook) throw new ConvexError("Recipe book not found");

    return recipeBook;
  },
});

export const createRecipeBook = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const newRecipeBookId = await ctx.db.insert("recipeBooks", {
      name: args.name,
      recipeIdList: [],
    });

    if (!newRecipeBookId) throw new ConvexError("Recipe book was not created");

    return newRecipeBookId;
  },
});
