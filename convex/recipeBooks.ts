import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { Privilage } from "@/enums";
import { GenericMutationCtx } from "convex/server";
import { filter } from "convex-helpers/server/filter";

const getUserEntity = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User not authenticated");
    }
    // Get User
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();
    if (!user) {
      throw new ConvexError("User is not present in database");
    }

    return user;
  },
});

export const getRecipeBookById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // TODO: Check if need to getUserEntity
    const recipeBook = await ctx.db
      .query("recipeBooks")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();

    if (!recipeBook) throw new ConvexError("Recipe book not found");

    return recipeBook;
  },
});

export const getRecipeBooks = query({
  args: {},
  handler: async (ctx, args) => {
    const userEntity = await getUserEntity(ctx, args);
    if (!userEntity) return [];

    const userRecipeBookRelationshipList = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) => q.eq(q.field("userId"), userEntity._id))
      .collect();
    const recipeBookIdList = userRecipeBookRelationshipList.map(
      (relation) => relation.recipeBookId
    );
    const recipeBookList = await filter(
      ctx.db.query("recipeBooks"),
      (recipeBook) => recipeBookIdList.includes(recipeBook._id)
    )
      .order("desc")
      .collect();

    return recipeBookList ?? [];
  },
});

export const createRecipeBook = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserEntity(ctx, args);
    if (!user) return;

    const newRecipeBookId = await ctx.db.insert("recipeBooks", {
      name: args.name,
    });
    if (!newRecipeBookId) throw new ConvexError("Recipe book was not created");

    const userRecipeBookRelationship = await ctx.db.insert(
      "userRecipeBookRelationship",
      {
        userId: user._id,
        recipeBookId: newRecipeBookId,
        privilage: Privilage.Owner,
      }
    );
    if (!userRecipeBookRelationship)
      throw new ConvexError("userRecipeBookRelationship was not created");

    return newRecipeBookId;
  },
});

export const deleteRecipeBook = mutation({
  args: {
    id: v.id("recipeBooks"),
  },
  handler: async (ctx, args) => {
    const recipeBook = await ctx.db.get(args.id);
    if (!recipeBook) throw new ConvexError("Recipe book not found");

    return await ctx.db.delete(args.id);
  },
});
