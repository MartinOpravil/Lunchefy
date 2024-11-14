import { createBadResponse, createOKResponse } from "@/lib/communication";
import { mutation, query } from "./_generated/server";
import { getLoggedUser } from "./users";
import { HttpResponseCode, Privilage } from "@/enums";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

// TODO: Filter out by groupId, it is missing
export const getRecipes = query({
  args: {
    groupId: v.string(),
    searchTerm: v.optional(v.string()),
    searchTags: v.optional(v.array(v.string())),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const query = filter(ctx.db.query("recipes"), (recipe) => {
      // If no search term or filters, return true (match all recipes)
      if (!args.searchTerm && !args.searchTags) {
        return true;
      }
      const matchesSearchTerm = args.searchTerm
        ? recipe.name.toLowerCase().includes(args.searchTerm.toLowerCase())
        : false;

      const matchesSearchFilters = args.searchTags?.length
        ? args.searchTags.some((tag) => recipe.tags?.includes(tag))
        : false;

      // If both searchTerm and searchFilters are provided, ensure both match
      if (args.searchTerm && args.searchTags?.length) {
        return matchesSearchTerm && matchesSearchFilters;
      }

      // Otherwise, return true if either condition is met
      return matchesSearchTerm || matchesSearchFilters;
    });

    const paginatedResult = await query.paginate(args.paginationOpts);
    return paginatedResult;
  },
});
// TODO: Check if I can use id of group directly instead of generic string
export const getRecipeById = query({
  args: { id: v.string(), checkPrivilages: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const recipe = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();
    if (!recipe)
      return createBadResponse(HttpResponseCode.NotFound, "Recipe not found");

    const userEntityResponse = await getLoggedUser(ctx, args);
    if (!userEntityResponse.data)
      return createBadResponse(
        userEntityResponse.status,
        userEntityResponse.errorMessage ?? ""
      );

    const userGroupRelationship = await ctx.db
      .query("userGroupRelationship")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userEntityResponse.data!._id),
          q.eq(q.field("groupId"), recipe.groupId)
        )
      )
      .unique();
    if (!userGroupRelationship)
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "No permission to view recipe"
      );

    if (
      args.checkPrivilages &&
      userGroupRelationship.privilage === Privilage.Viewer
    ) {
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "You don't have access to edit this recipe."
      );
    }

    return createOKResponse({
      ...recipe,
      privilage: userGroupRelationship.privilage as Privilage,
    });
  },
});

export const createRecipe = mutation({
  args: {
    groupId: v.id("groups"),
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
    isImageRecipe: v.boolean(),
    ingredients: v.optional(v.string()),
    instructions: v.optional(v.string()),
    recipeImage: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const newGroupId = await ctx.db.insert("recipes", {
      groupId: args.groupId,
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
      ingredients: args.ingredients,
      instructions: args.instructions,
      recipeImage: args.recipeImage,
      isImageRecipe: args.isImageRecipe,
      tags: args.tags,
    });
    if (!newGroupId) {
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Recipe was not created - Not able to insert into database."
      );
    }

    return createOKResponse({
      groupId: newGroupId,
    });
  },
});

export const updateRecipe = mutation({
  args: {
    id: v.id("recipes"),
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
    isImageRecipe: v.boolean(),
    ingredients: v.optional(v.string()),
    instructions: v.optional(v.string()),
    recipeImage: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const recipe = await ctx.db.get(args.id);
    if (!recipe) {
      return createBadResponse(
        HttpResponseCode.NotFound,
        "Cannot update because Recipe was not found"
      );
    }

    // Handle cover photo deletion
    if (
      recipe.coverImage?.storageId &&
      recipe.coverImage?.imageUrl !== args.coverImage?.imageUrl
    ) {
      await ctx.storage.delete(recipe.coverImage.storageId);
    }

    // Handle recipe photo deletion
    if (
      recipe.recipeImage?.storageId &&
      (!args.isImageRecipe ||
        recipe.recipeImage?.imageUrl !== args.recipeImage?.imageUrl)
    ) {
      await ctx.storage.delete(recipe.recipeImage.storageId);
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
      ingredients: args.ingredients,
      instructions: args.instructions,
      recipeImage: args.isImageRecipe ? args.recipeImage : undefined,
      isImageRecipe: args.isImageRecipe,
      tags: args.tags,
    });
    return createOKResponse(true);
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
        "Recipe was not deleted."
      );
    }

    // Delete image from storage
    if (recipe.coverImage?.storageId)
      await ctx.storage.delete(recipe.coverImage.storageId);
    if (recipe.recipeImage?.storageId)
      await ctx.storage.delete(recipe.recipeImage.storageId);

    await ctx.db.delete(recipe._id);
    return createOKResponse(true);
  },
});
