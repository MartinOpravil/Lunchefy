import { createBadResponse, createOKResponse } from "@/lib/communication";
import { mutation, query } from "./_generated/server";
import { getLoggedUser } from "./users";
import { HttpResponseCode, Privilage } from "@/enums";
import { v } from "convex/values";
import { paginationOptsValidator, QueryInitializer } from "convex/server";
import { Author } from "@/types";

export const getRecipes = query({
  args: {
    groupId: v.string(),
    searchTerm: v.optional(v.string()),
    searchTags: v.optional(v.array(v.string())),
    paginationOpts: paginationOptsValidator,
    dateMiliseconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query;

    if (args.searchTerm) {
      query = ctx.db
        .query("recipes")
        .withSearchIndex("nameSearch", (q) =>
          q.search("name", args.searchTerm!)
        );
    } else if (args.searchTags?.length) {
      query = ctx.db
        .query("recipes")
        .withSearchIndex("tagSearch", (q) =>
          q.search("tags", args.searchTags!.join(" "))
        );
    } else {
      query = ctx.db.query("recipes").order("desc");
    }

    let filteredQuery;

    if (args.dateMiliseconds) {
      filteredQuery = query.filter((q) =>
        q.and(
          q.eq(q.field("groupId"), args.groupId),
          q.lt(q.field("_creationTime"), args.dateMiliseconds!)
        )
      );
    } else {
      filteredQuery = query.filter((q) =>
        q.eq(q.field("groupId"), args.groupId)
      );
    }

    return await filteredQuery.paginate(args.paginationOpts);
  },
});

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

    let author: Author | undefined = undefined;

    if (recipe.lastChange && recipe.lastChange.authorId) {
      const authorResult = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), recipe.lastChange!.authorId))
        .unique();

      if (authorResult) {
        author = {
          id: authorResult._id,
          imageSrc: authorResult.imageUrl,
          name: authorResult.name,
          date: recipe.lastChange.date,
        };
      }
    }

    return createOKResponse({
      ...recipe,
      privilage: userGroupRelationship.privilage as Privilage,
      isVerified: userEntityResponse.data.isVerified,
      author,
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
        imageUrl: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        externalUrl: v.optional(v.string()),
      })
    ),
    isImageRecipe: v.boolean(),
    ingredients: v.optional(v.string()),
    instructions: v.optional(v.string()),
    recipeImage: v.optional(
      v.object({
        imageUrl: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        externalUrl: v.optional(v.string()),
      })
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const newRecipeId = await ctx.db.insert("recipes", {
      groupId: args.groupId,
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
      ingredients: args.ingredients,
      instructions: args.instructions,
      recipeImage: args.recipeImage,
      isImageRecipe: args.isImageRecipe,
      tags: args.tags?.join(" "),
      lastChange: {
        authorId: userResponse.data._id,
        date: Date.now(),
      },
    });
    if (!newRecipeId) {
      return createBadResponse(HttpResponseCode.InternalServerError);
    }

    return createOKResponse({
      recipeId: newRecipeId,
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
        imageUrl: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        externalUrl: v.optional(v.string()),
      })
    ),
    isImageRecipe: v.boolean(),
    ingredients: v.optional(v.string()),
    instructions: v.optional(v.string()),
    recipeImage: v.optional(
      v.object({
        imageUrl: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        externalUrl: v.optional(v.string()),
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
      return createBadResponse(HttpResponseCode.NotFound);
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
      tags: args.tags?.join(" "),
      lastChange: {
        authorId: userResponse.data._id,
        date: Date.now(),
      },
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
      return createBadResponse(HttpResponseCode.InternalServerError);
    }

    // Delete all plans that contains recipeId
    const planList = await ctx.db
      .query("groupPlans")
      .filter((q) => q.eq(q.field("recipeId"), args.recipeId))
      .collect();
    await Promise.all(
      planList.map(async (p) => {
        ctx.db.delete(p._id);
      })
    );

    // Delete image from storage
    if (recipe.coverImage?.storageId)
      await ctx.storage.delete(recipe.coverImage.storageId);
    if (recipe.recipeImage?.storageId)
      await ctx.storage.delete(recipe.recipeImage.storageId);

    await ctx.db.delete(recipe._id);
    return createOKResponse(true);
  },
});
