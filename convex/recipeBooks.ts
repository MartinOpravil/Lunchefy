import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { Privilage } from "@/enums";
import { GenericMutationCtx } from "convex/server";
import { filter } from "convex-helpers/server/filter";

const getUserEntity = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User not authenticated");
    }
    // Get User
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();
    if (!user) {
      throw new ConvexError("User is not present in database");
    }

    return user;
  },
});

export const getRecipeBookById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // TODO: Check if need to getUserEntity
    const userEntity = await getUserEntity(ctx, args);
    if (!userEntity) return;

    // TODO: Handle viewing of recipe book by permissions
    const userRecipeBookRelationship = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userEntity._id),
          q.eq(q.field("recipeBookId"), args.id)
        )
      )
      .unique();
    if (!userRecipeBookRelationship)
      throw new ConvexError("No permission to view recipe book");

    const recipeBook = await ctx.db
      .query("recipeBooks")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();

    if (!recipeBook) throw new ConvexError("Recipe book not found");

    return recipeBook;
  },
});

export const getRecipeBooks = query({
  args: {},
  handler: async (ctx, args) => {
    const userEntity = await getUserEntity(ctx, args);
    if (!userEntity) return [];

    const userRecipeBookRelationshipList = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) => q.eq(q.field("userId"), userEntity._id))
      .collect();
    const recipeBookIdList = userRecipeBookRelationshipList.map(
      (relation) => relation.recipeBookId
    );
    const recipeBookList = await filter(
      ctx.db.query("recipeBooks"),
      (recipeBook) => recipeBookIdList.includes(recipeBook._id)
    )
      .order("desc")
      .collect();

    return recipeBookList ?? [];
  },
});

export const createRecipeBook = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
    image: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getUserEntity(ctx, args);
    if (!user) return;

    const newRecipeBookId = await ctx.db.insert("recipeBooks", {
      name: args.name,
      image: args.image,
    });
    if (!newRecipeBookId) throw new ConvexError("Recipe book was not created");

    const userRecipeBookRelationship = await ctx.db.insert(
      "userRecipeBookRelationship",
      {
        userId: user._id,
        recipeBookId: newRecipeBookId,
        privilage: Privilage.Owner,
      }
    );
    if (!userRecipeBookRelationship)
      throw new ConvexError("userRecipeBookRelationship was not created");

    return newRecipeBookId;
  },
});

export const deleteRecipeBook = mutation({
  args: {
    id: v.id("recipeBooks"),
  },
  handler: async (ctx, args) => {
    // TODO: Change behavior according to privilages

    const recipeBook = await ctx.db.get(args.id);
    if (!recipeBook) throw new ConvexError("Recipe book not found");

    // Delete image from storage
    if (recipeBook.image && recipeBook.image.storageId)
      await ctx.storage.delete(recipeBook.image.storageId);

    // Delete all relationsips
    const relationship = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) => q.eq(q.field("recipeBookId"), recipeBook._id))
      .collect();
    await Promise.all(
      relationship.map(async (p) => {
        await ctx.db.delete(p._id);
      })
    );

    return await ctx.db.delete(args.id);
  },
});

// TODO: Implement soft delete for users that have shared recipe book and want to remove it from list -> remove record from userRecipeBookRelationship

export const updateRecipeBook = mutation({
  args: {
    id: v.id("recipeBooks"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    image: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getUserEntity(ctx, args);
    if (!user) return;

    const recipeBook = await ctx.db.get(args.id);
    if (!recipeBook) throw new ConvexError("Recipe book not found");

    // Delete previous image if image changes
    const recipeBookImage = recipeBook.image;
    if (
      recipeBookImage?.imageUrl !== args.imageUrl &&
      recipeBookImage?.storageId
    ) {
      await ctx.storage.delete(recipeBookImage.storageId);
    }

    return await ctx.db.patch(args.id, {
      name: args.name,
      image: args.image,
    });
  },
});
