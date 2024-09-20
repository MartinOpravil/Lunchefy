import { createBadResponse, createOKResponse } from "@/lib/communication";
import { mutation, query } from "./_generated/server";
import { getLoggedUser } from "./users";
import { HttpResponseCode, Privilage } from "@/enums";
import { v } from "convex/values";

export const getRecipes = query({
  args: {
    recipeBookId: v.string(),
  },
  handler: async (ctx, args) => {
    const userEntityResponse = await getLoggedUser(ctx, args);
    if (!userEntityResponse.data)
      return createBadResponse(
        userEntityResponse.status,
        userEntityResponse.errorMessage
      );

    const userRecipeBookRelationship = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userEntityResponse.data!._id),
          q.eq(q.field("recipeBookId"), args.recipeBookId)
        )
      )
      .unique();
    if (!userRecipeBookRelationship)
      return createBadResponse(
        HttpResponseCode.NotFound,
        "You don't have access to view this recipe book recipes"
      );

    const recipes = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("recipeBookId"), args.recipeBookId))
      .collect();

    return createOKResponse(
      {
        recipes,
        privilage: userRecipeBookRelationship.privilage as Privilage,
      } ?? []
    );
  },
});

export const createRecipe = mutation({
  args: {
    recipeBookId: v.id("recipeBooks"),
    name: v.string(),
    description: v.optional(v.string()),
    image: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
    recipe: v.string(),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const newRecipeBookId = await ctx.db.insert("recipes", {
      recipeBookId: args.recipeBookId,
      name: args.name,
      description: args.description,
      image: args.image,
      recipe: args.recipe,
    });
    if (!newRecipeBookId) {
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Recipe was not created - Not able to insert into database."
      );
    }

    return createOKResponse({
      recipeBookId: newRecipeBookId,
    });
  },
});

export const deleteRecipe = mutation({
  args: {
    recipeId: v.id("recipes"),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) {
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Recipe book was not deleted."
      );
    }

    // Delete image from storage
    if (recipe.image && recipe.image.storageId)
      await ctx.storage.delete(recipe.image.storageId);

    await ctx.db.delete(recipe._id);
    return createOKResponse(true);
  },
});