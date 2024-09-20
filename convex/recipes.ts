import { createBadResponse, createOKResponse } from "@/lib/communication";
import { query } from "./_generated/server";
import { getLoggedUser } from "./users";
import { HttpResponseCode, Privilage } from "@/enums";
import { Doc } from "./_generated/dataModel";
import { filter } from "convex-helpers/server/filter";
import { v } from "convex/values";

export const getRecipes = query({
  args: {
    recipeBookId: v.id("recipeBooks"),
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
