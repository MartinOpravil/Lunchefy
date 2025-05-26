// import { removeDiacritics } from "@/lib/utils";
import { mutation } from "../_generated/server";

export const UserMigration = mutation({
  args: {},
  handler: async (ctx, args) => {
    // const userList = await ctx.db.query("users").collect();
    // for (const user of userList) {
    //   await ctx.db.patch(user._id, {
    //   });
    // }
  },
});

export const RecipeMigration = mutation({
  args: {},
  handler: async (ctx, args) => {
    // const recipeList = await ctx.db
    //   .query("recipes")
    //   .filter((q) => q.eq(q.field("nameNormalized"), undefined))
    //   .collect();
    // for (const recipe of recipeList) {
    //   await ctx.db.patch(recipe._id, {
    //     nameNormalized: removeDiacritics(recipe.name),
    //   });
    // }
  },
});
