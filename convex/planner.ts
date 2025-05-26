import { filter } from "convex-helpers/server/filter";
import { v } from "convex/values";

import { HttpResponseCode } from "@/enums";
import { createBadResponse, createOKResponse } from "@/lib/communication";
import { Plan } from "@/types";

import { mutation, query } from "./_generated/server";

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
        plan.groupId === args.groupId && plan.date === today.toISOString(),
    ).collect();

    if (!groupPlans.length) {
      return createOKResponse([]);
    }

    const recipeIdList = groupPlans.map((x) => x.recipeId);

    const recipeList = await filter(ctx.db.query("recipes"), (recipe) =>
      recipeIdList.includes(recipe._id),
    )
      .collect()
      .then((x) =>
        x.sort((a, b) => a.nameNormalized.localeCompare(b.nameNormalized)),
      );

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
      (x) => x.groupId === args.groupId && x.date.startsWith(args.month),
    ).collect();

    const recipeIdList = new Set(groupPlans.map((x) => x.recipeId));

    const recipes = await filter(ctx.db.query("recipes"), (recipe) =>
      recipeIdList.has(recipe._id),
    ).collect();

    const recipeMap = new Map(recipes.map((recipe) => [recipe._id, recipe]));

    const plan = groupPlans
      .map((plan) => {
        return {
          planId: plan._id,
          date: plan.date,
          recipe: recipeMap.get(plan.recipeId),
          creationTime: plan._creationTime,
        } as Plan;
      })
      .sort((a, b) => (a.creationTime > b.creationTime ? 1 : -1));

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
        plan.date === args.date,
    ).collect();

    if (groupPlans.length) return createBadResponse(HttpResponseCode.Conflict);

    const insertResult = await ctx.db.insert("groupPlans", {
      groupId: args.groupId,
      recipeId: args.recipeId,
      date: args.date,
    });

    const latestPreviousRecipePlanDate = await getLatestRecipePlanDate(ctx, {
      groupId: args.groupId,
      recipeId: args.recipeId,
    });

    await ctx.db.patch(args.recipeId, {
      plannerDate: new Date(
        latestPreviousRecipePlanDate.data
          ? latestPreviousRecipePlanDate.data
          : args.date,
      ).getTime(),
    });

    if (!insertResult)
      return createBadResponse(HttpResponseCode.InternalServerError);

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
        x.date === plan.date,
    ).unique();

    if (newRecipePlanInDate) {
      return createBadResponse(HttpResponseCode.Conflict);
    }

    await ctx.db.patch(args.planId, {
      recipeId: args.newRecipeId,
    });

    const latestPreviousRecipePlanDate = await getLatestRecipePlanDate(ctx, {
      groupId: plan.groupId,
      recipeId: plan.recipeId,
    });
    if (!latestPreviousRecipePlanDate.data) {
      await ctx.db.patch(plan.recipeId, {
        plannerDate: undefined,
      });
    } else {
      const latestRecipePlanDateMiliseconds = new Date(
        latestPreviousRecipePlanDate.data,
      ).getTime();

      await ctx.db.patch(plan.recipeId, {
        plannerDate: latestRecipePlanDateMiliseconds,
      });
    }

    const latestNewRecipePlanDate = await getLatestRecipePlanDate(ctx, {
      groupId: plan.groupId,
      recipeId: args.newRecipeId,
    });
    if (!latestNewRecipePlanDate.data) {
      await ctx.db.patch(args.newRecipeId, {
        plannerDate: undefined,
      });
    } else {
      const latestRecipePlanDateMiliseconds = new Date(
        latestNewRecipePlanDate.data,
      ).getTime();

      await ctx.db.patch(args.newRecipeId, {
        plannerDate: latestRecipePlanDateMiliseconds,
      });
    }

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

    const latestRecipePlanDate = await getLatestRecipePlanDate(ctx, {
      groupId: plan.groupId,
      recipeId: plan.recipeId,
    });

    let latestRecipePlanDateMiliseconds;

    if (latestRecipePlanDate.data) {
      latestRecipePlanDateMiliseconds = new Date(
        latestRecipePlanDate.data,
      ).getTime();
    }

    await ctx.db.patch(plan.recipeId, {
      plannerDate: latestRecipePlanDateMiliseconds,
    });

    return createOKResponse(true);
  },
});

export const getLatestRecipePlanDate = query({
  args: {
    groupId: v.string(),
    recipeId: v.string(),
  },
  handler: async (ctx, args) => {
    const planList = await ctx.db
      .query("groupPlans")
      .filter((q) =>
        q.and(
          q.eq(q.field("groupId"), args.groupId),
          q.eq(q.field("recipeId"), args.recipeId),
        ),
      )
      .collect();

    if (!planList.length) {
      return createOKResponse(null);
    }

    const newestPlan = planList.sort((a, b) => (a.date < b.date ? 1 : -1))[0];

    return createOKResponse(newestPlan.date);
  },
});
