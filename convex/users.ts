import { ConvexError, v } from "convex/values";

import { HttpResponseCode } from "@/enums";
import { createBadResponse, createOKResponse } from "@/lib/communication";

import { internalMutation, query } from "./_generated/server";

export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) throw new ConvexError("User not found");

    return user;
  },
});
export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
      isVerified: false,
    });
  },
});
export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);
  },
});
export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
      name: args.name,
    });
  },
});

export const getLoggedUser = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return createBadResponse(
        HttpResponseCode.Unauthorized,
        "User not authenticated",
      );
    }
    // Get User
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();
    if (!user) {
      return createBadResponse(
        HttpResponseCode.NotFound,
        "User is not present in database",
      );
    }

    return createOKResponse(user);
  },
});
