import { createBadResponse, createOKResponse } from "@/lib/communication";
import { mutation, query } from "./_generated/server";
import { getLoggedUser } from "./users";
import { HttpResponseCode, Privilage } from "@/enums";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const getRecipes = query({
  args: {
    recipeBookId: v.string(),
    searchTerm: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let query = undefined;

    if (!args.searchTerm) {
      query = ctx.db
        .query("recipes")
        .filter((q) => q.eq(q.field("recipeBookId"), args.recipeBookId))
        .order("desc");
    } else {
      query = ctx.db
        .query("recipes")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.searchTerm ?? "")
        )
        .filter((q) => q.eq(q.field("recipeBookId"), args.recipeBookId));
    }
    const paginatedResult = await query.paginate(args.paginationOpts);
    return paginatedResult;
  },
});

// export const getRecipesByFilter = query({
//   args: {
//     recipeBookId: v.string(),
//     searchTerm: v.optional(v.string()),
//     paginationOpts: paginationOptsValidator,
//   },
//   handler: async (ctx, args) => {
//     // const userEntityResponse = await getLoggedUser(ctx, args);
//     // if (!userEntityResponse.data)
//     //   return createBadResponse(
//     //     userEntityResponse.status,
//     //     userEntityResponse.errorMessage
//     //   );

//     // const userRecipeBookRelationship = await ctx.db
//     //   .query("userRecipeBookRelationship")
//     //   .filter((q) =>
//     //     q.and(
//     //       q.eq(q.field("userId"), userEntityResponse.data!._id),
//     //       q.eq(q.field("recipeBookId"), args.recipeBookId)
//     //     )
//     //   )
//     //   .unique();
//     // if (!userRecipeBookRelationship)
//     //   return createBadResponse(
//     //     HttpResponseCode.NotFound,
//     //     "You don't have access to view this recipe book recipes"
//     //   );

//     // const recipes = await ctx.db
//     //   .query("recipes")
//     //   .filter((q) => q.eq(q.field("recipeBookId"), args.recipeBookId))
//     //   .paginate(args.paginationOpts);
//     // .collect();

//     // const recipes = await filter(
//     //   ctx.db.query("recipes"),
//     //   (recipe) =>
//     //     recipe.recipeBookId === args.recipeBookId &&
//     //     (!args.searchTerm ||
//     //       recipe.name.toLowerCase().includes(args.searchTerm.toLowerCase()))
//     // )
//     //   .order("desc")
//     //   .paginate(args.paginationOpts);
//     console.log("SearchTerm: ", args.searchTerm);
//     // let query = ctx.db
//     //   .query("recipes")
//     //   .filter((q) => q.eq(q.field("recipeBookId"), args.recipeBookId));
//     // console.log("FirstFilter: ", query);
//     // if (args.searchTerm) {
//     //   query = filter(query, (recipe) =>
//     //     recipe.name.toLowerCase().includes(args.searchTerm!.toLowerCase())
//     //   );
//     // }

//     // let query = filter(ctx.db.query("recipes"), (recipe) =>
//     //   recipe.name.toLowerCase().includes(args.searchTerm!.toLowerCase())
//     // );

//     // let query = filter(ctx.db.query("recipes"), (recipe) =>
//     //   recipe.name.toLowerCase().includes("ve")
//     // );

//     let query = ctx.db
//       .query("recipes")
//       .withSearchIndex("search_name", (q) =>
//         q.search("name", args.searchTerm ?? "")
//       )
//       .filter((q) => q.eq(q.field("recipeBookId"), args.recipeBookId));
//     // if (args.searchTerm)
//     //   query.withSearchIndex("search_name", (q) =>
//     //     q.search("name", args.searchTerm!)
//     //   );

//     console.log("SecondFilter: ", query);
//     const paginatedResult = await query
//       // .order("desc") // Example ordering
//       .paginate(args.paginationOpts);
//     console.log("PaginatedResult: ", paginatedResult);
//     // return createOKResponse({
//     //   recipes,
//     //   privilage: userRecipeBookRelationship.privilage as Privilage,
//     // });
//     return {
//       ...paginatedResult,
//       // privilage: Privilage.Owner,
//     };
//   },
// });

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

    const userRecipeBookRelationship = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userEntityResponse.data!._id),
          q.eq(q.field("recipeBookId"), recipe.recipeBookId)
        )
      )
      .unique();
    if (!userRecipeBookRelationship)
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "No permission to view recipe"
      );

    if (
      args.checkPrivilages &&
      userRecipeBookRelationship.privilage === Privilage.Viewer
    ) {
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "You don't have access to edit this recipe."
      );
    }

    return createOKResponse({
      ...recipe,
      privilage: userRecipeBookRelationship.privilage as Privilage,
    });
  },
});

export const createRecipe = mutation({
  args: {
    recipeBookId: v.id("recipeBooks"),
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
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const newRecipeBookId = await ctx.db.insert("recipes", {
      recipeBookId: args.recipeBookId,
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
      ingredients: args.ingredients,
      instructions: args.instructions,
      recipeImage: args.recipeImage,
      isImageRecipe: args.isImageRecipe,
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
        "Recipe book was not deleted."
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
