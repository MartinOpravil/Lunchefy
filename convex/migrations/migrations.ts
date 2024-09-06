import { ConvexError } from "convex/values";
import { mutation } from "../_generated/server";

export const UserMigration = mutation({
  args: {},
  handler: async (ctx, args) => {
    const userList = await ctx.db.query("users").collect();
    for (const user of userList) {
      await ctx.db.patch(user._id, {
        //recipeBookIdList: undefined,
      });
    }
  },
});
