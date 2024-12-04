import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { createBadResponse, createOKResponse } from "@/lib/communication";
import { filter } from "convex-helpers/server/filter";
import { HttpResponseCode } from "@/enums";
import { Plan } from "@/types";

export const getTodayRecipe = query({
  args: {
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const groupPlans = await filter(
      ctx.db.query("groupPlans"),
      (plan) =>
        plan.groupId === args.groupId && plan.date === today.toISOString()
    ).collect();

    if (!groupPlans.length) {
      return createOKResponse([]);
    }

    const recipeIdList = groupPlans.map((x) => x.recipeId);

    const recipeList = await filter(ctx.db.query("recipes"), (recipe) =>
      recipeIdList.includes(recipe._id)
    ).collect();

    return createOKResponse(recipeList);
  },
});
export const getGroupRecipeListForMonth = query({
  args: {
    groupId: v.string(),
    month: v.string(),
  },
  handler: async (ctx, args) => {
    const groupPlans = await filter(
      ctx.db.query("groupPlans"),
      (x) => x.groupId === args.groupId && x.date.startsWith(args.month)
    ).collect();

    const recipeIdList = new Set(groupPlans.map((x) => x.recipeId));

    const recipes = await filter(ctx.db.query("recipes"), (recipe) =>
      recipeIdList.has(recipe._id)
    ).collect();

    const recipeMap = new Map(recipes.map((recipe) => [recipe._id, recipe]));

    const plan = groupPlans
      .map((plan) => {
        return {
          planId: plan._id,
          date: plan.date,
          recipe: recipeMap.get(plan.recipeId),
        } as Plan;
      })
      .sort((a, b) => (a.date > b.date ? 1 : -1));

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
    const groupPlans = await filter(
      ctx.db.query("groupPlans"),
      (plan) =>
        plan.groupId === args.groupId &&
        plan.recipeId === args.recipeId &&
        plan.date === args.date
    ).collect();

    if (groupPlans.length) return createBadResponse(HttpResponseCode.Conflict);

    const result = await ctx.db.insert("groupPlans", {
      groupId: args.groupId,
      recipeId: args.recipeId,
      date: args.date,
    });

    if (!result) return createBadResponse(HttpResponseCode.InternalServerError);

    return createOKResponse(true);
  },
});

export const changeRecipeInDate = mutation({
  args: {
    newRecipeId: v.id("recipes"),
    planId: v.id("groupPlans"),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      return createBadResponse(HttpResponseCode.NotFound);
    }

    if (plan.recipeId === args.newRecipeId) {
      return createBadResponse(HttpResponseCode.BadRequest);
    }

    const newRecipePlanInDate = await filter(
      ctx.db.query("groupPlans"),
      (x) =>
        x.groupId === plan.groupId &&
        x.recipeId === args.newRecipeId &&
        x.date === plan.date
    ).unique();

    if (newRecipePlanInDate) {
      return createBadResponse(HttpResponseCode.Conflict);
    }

    await ctx.db.patch(args.planId, {
      recipeId: args.newRecipeId,
    });
    return createOKResponse(true);
  },
});

export const removeRecipeFromDate = mutation({
  args: {
    planId: v.id("groupPlans"),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      return createBadResponse(HttpResponseCode.NotFound);
    }

    await ctx.db.delete(args.planId);
    return createOKResponse(true);
  },
});
