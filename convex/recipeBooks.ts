import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { HttpResponseCode, Privilage } from "@/enums";
import { filter } from "convex-helpers/server/filter";
import HttpResponse, { OKHttpResponse } from "@/classes/HttpResponse";
import { Doc } from "./_generated/dataModel";

// TODO: Make wrapper for responses to unify usage

const getUserEntity = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new HttpResponse({
        status: HttpResponseCode.Unauthorized,
        errorMessage: "User not authenticated",
      });
    }
    // Get User
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();
    if (!user) {
      return new HttpResponse({
        status: HttpResponseCode.NotFound,
        errorMessage: "User is not present in database",
      });
    }

    return new OKHttpResponse(user);
  },
});

export const getRecipeBookById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userEntityResponse = await getUserEntity(ctx, args);
    if (!userEntityResponse) return userEntityResponse;

    const userRecipeBookRelationship = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) =>
        q.and(
          q.eq(
            q.field("userId"),
            (userEntityResponse.data as Doc<"users">)._id
          ),
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

    return {
      ...recipeBook,
      privilage: userRecipeBookRelationship.privilage as Privilage,
    };
  },
});

export const getRecipeBooks = query({
  args: {},
  handler: async (ctx, args) => {
    const userEntityResponse = await getUserEntity(ctx, args);
    if (!userEntityResponse) return [];

    const userRecipeBookRelationshipList = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) =>
        q.eq(q.field("userId"), (userEntityResponse.data as Doc<"users">)._id)
      )
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

    const recipeBookListWithPrivilage = recipeBookList.map((recipeBook) => {
      const privilage = userRecipeBookRelationshipList.find(
        (relation) => relation.recipeBookId === recipeBook._id
      )?.privilage as string;
      return {
        ...recipeBook,
        privilage: privilage as Privilage,
      };
    });

    return recipeBookListWithPrivilage ?? [];
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
      recipeBookImage?.imageUrl !== args.image?.imageUrl &&
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

export const addAccessToRecipeBook = mutation({
  args: {
    email: v.string(),
    recipeBookId: v.id("recipeBooks"),
  },
  handler: async (ctx, args) => {
    const userEntity = await getUserEntity(ctx, args);
    if (!userEntity) return false;

    const emailUserEntity = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    if (!emailUserEntity) {
      console.log("Email is not registered yet");
      return false;
    }

    const userRecipeBookRelationshipList = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), emailUserEntity._id),
          q.eq(q.field("recipeBookId"), args.recipeBookId)
        )
      )
      .collect();

    if (userRecipeBookRelationshipList.length) {
      console.log("User already has access to this recipe book");
      return false;
    }

    const insertResult = await ctx.db.insert("userRecipeBookRelationship", {
      userId: emailUserEntity._id,
      recipeBookId: args.recipeBookId,
      privilage: Privilage.Editor,
    });

    return !!insertResult;
  },
});
export const changeAccessToRecipeBook = mutation({
  args: {
    relationShipId: v.id("userRecipeBookRelationship"),
    privilage: v.string(),
  },
  handler: async (ctx, args) => {
    const userEntity = await getUserEntity(ctx, args);
    if (!userEntity) return false;

    const relationship = await ctx.db.get(args.relationShipId);

    if (!relationship) {
      console.log("User does not have access recipe book", args.relationShipId);
      return;
    }

    await ctx.db.patch(relationship._id, {
      privilage: args.privilage,
    });
  },
});
export const revokeAccessToRecipeBook = mutation({
  args: {
    relationShipId: v.id("userRecipeBookRelationship"),
  },
  handler: async (ctx, args) => {
    const userEntity = await getUserEntity(ctx, args);
    if (!userEntity) return false;

    const relationship = await ctx.db.get(args.relationShipId);

    if (!relationship) {
      console.log("User does not have access recipe book", args.relationShipId);
      return;
    }

    await ctx.db.delete(args.relationShipId);
  },
});

export const getRecipebookSharedUsers = query({
  args: {
    recipeBookId: v.id("recipeBooks"),
  },
  handler: async (ctx, args) => {
    const userEntity = await getUserEntity(ctx, args);
    if (!userEntity) return false;

    const userRecipeBookRelationshipList = await ctx.db
      .query("userRecipeBookRelationship")
      .filter((q) => q.eq(q.field("recipeBookId"), args.recipeBookId))
      .collect();

    const userIdList = userRecipeBookRelationshipList.map(
      (relation) => relation.userId
    );
    const userList = await filter(ctx.db.query("users"), (user) =>
      userIdList.includes(user._id)
    )
      .filter((q) => q.neq(q.field("_id"), userEntity._id))
      .order("desc")
      .collect();

    const userListResponse = userList.map((user) => {
      const relationship = userRecipeBookRelationshipList.find(
        (relation) => relation.userId === user._id
      );
      return {
        relationshipId: relationship!._id,
        name: user.name,
        email: user.email,
        privilage: relationship?.privilage as Privilage,
      };
    });

    return userListResponse;
  },
});
