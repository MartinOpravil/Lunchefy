import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { createBadResponse, createOKResponse } from "@/lib/communication";
import { filter } from "convex-helpers/server/filter";
import { HttpResponseCode } from "@/enums";

export const getTodayRecipe = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    console.log("Today: ", today.toISOString());
    const plannedGroupRecipes = await filter(
      ctx.db.query("plannedGroupRecipes"),
      (plan) =>
        plan.groupId === args.groupId && plan.date === today.toISOString()
    ).collect();

    // const plannedGroupRecipes = await ctx.db
    //   .query("plannedGroupRecipes")
    //   .filter(
    //     (q) =>
    //       q.eq(q.field("groupId"), args.groupId) &&
    //       q.eq(q.field("date"), today.toISOString())
    //   )
    //   .collect();

    if (!plannedGroupRecipes.length) {
      return createOKResponse([]);
    }

    const recipeIdList = plannedGroupRecipes.map((x) => x.recipeId);

    const recipeList = await filter(ctx.db.query("recipes"), (recipe) =>
      recipeIdList.includes(recipe._id)
    ).collect();

    return createOKResponse(recipeList);
  },
});
// TODO: Return new response containing id of plannerTableId to simplify logic
export const getGroupRecipeListForMonth = query({
  args: {
    groupId: v.id("groups"),
    month: v.string(),
  },
  handler: async (ctx, args) => {
    const plannedGroupRecipes = await filter(
      ctx.db.query("plannedGroupRecipes"),
      (x) => x.groupId === args.groupId && x.date.startsWith(args.month)
    ).collect();

    // TODO: Create Set to iterate through
    const recipeIdList = new Set(plannedGroupRecipes.map((x) => x.recipeId));

    const recipes = await filter(ctx.db.query("recipes"), (recipe) =>
      recipeIdList.has(recipe._id)
    ).collect();

    const recipeMap = new Map(recipes.map((recipe) => [recipe._id, recipe]));

    const plan = plannedGroupRecipes.map((plan) => {
      return {
        id: plan._id,
        date: plan.date,
        recipe: recipeMap.get(plan.recipeId),
      };
    });

    // const recipesWithPlanId = recipes.map((recipe) => {
    //   return {
    //     ...recipe,
    //     plannerId: plannedGroupRecipes.find((x) => x.recipeId === recipe._id)
    //       ?._id,
    //   };
    // });
    return createOKResponse(plan);
  },
});

export const assignRecipeToDate = mutation({
  args: {
    groupId: v.id("groups"),
    recipeId: v.id("recipes"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("date", args.date);

    const plannedGroupRecipes = await filter(
      ctx.db.query("plannedGroupRecipes"),
      (plan) =>
        plan.groupId === args.groupId &&
        plan.recipeId === args.recipeId &&
        plan.date === args.date
    ).collect();

    // console.log(
    //   "plannedGroupRecipes length",
    //   plannedGroupRecipes.length,
    //   plannedGroupRecipes[0].date
    // );

    if (plannedGroupRecipes.length)
      return createBadResponse(
        HttpResponseCode.Conflict,
        "Recipe is already assigned to date."
      );

    const result = await ctx.db.insert("plannedGroupRecipes", {
      groupId: args.groupId,
      recipeId: args.recipeId,
      date: args.date,
    });
    console.log("result", result);

    if (!result)
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Recipe was not assign to date."
      );

    return createOKResponse(true);
  },
});

export const changeRecipeInDate = mutation({
  args: {
    groupId: v.id("groups"),
    oldRecipeId: v.id("recipes"),
    newRecipeId: v.id("recipes"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.oldRecipeId === args.newRecipeId)
      return createBadResponse(
        HttpResponseCode.BadRequest,
        "Old and New recipes are the same."
      );

    const plannedGroupRecipes = await ctx.db
      .query("plannedGroupRecipes")
      .filter(
        (q) =>
          q.eq(q.field("groupId"), args.groupId) &&
          q.eq(q.field("date"), args.date)
      )
      .collect();

    if (!plannedGroupRecipes)
      return createBadResponse(
        HttpResponseCode.NotFound,
        "Cannot change recipe. Date does not have any recipe yet."
      );

    if (plannedGroupRecipes.find((x) => x.recipeId === args.newRecipeId)) {
      return createBadResponse(
        HttpResponseCode.Conflict,
        "Recipe is already assigned to date."
      );
    }

    const oldRecipePlannedDateId = plannedGroupRecipes.find(
      (x) => x.recipeId === args.oldRecipeId
    )?._id;
    if (!oldRecipePlannedDateId)
      return createBadResponse(
        HttpResponseCode.NotFound,
        "Recipe that you are trying to change does not exists."
      );

    await ctx.db.patch(oldRecipePlannedDateId, {
      recipeId: args.newRecipeId,
    });
    return createOKResponse(true);
  },
});

export const removeRecipeFromDate = mutation({
  args: {
    groupId: v.id("groups"),
    recipeId: v.id("recipes"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const plannedGroupRecipes = await ctx.db
      .query("plannedGroupRecipes")
      .filter(
        (q) =>
          q.eq(q.field("groupId"), args.groupId) &&
          q.eq(q.field("date"), args.date) &&
          q.eq(q.field("recipeId"), args.recipeId)
      )
      .unique();

    if (!plannedGroupRecipes)
      return createBadResponse(
        HttpResponseCode.BadRequest,
        "Cannot remove recipe. Given recipe is not assigned to this date."
      );

    await ctx.db.delete(plannedGroupRecipes._id);
    return createOKResponse(true);
  },
});
