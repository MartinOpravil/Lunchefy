import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { HttpResponseCode, Privilage } from "@/enums";
import { filter } from "convex-helpers/server/filter";
import { Doc } from "./_generated/dataModel";
import { createBadResponse, createOKResponse } from "@/lib/communication";
import { getLoggedUser } from "./users";

// QUERIES -------------------------------------------

export const getRecipeBookById = query({
  args: { id: v.string(), checkPrivilages: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const recipeBook = await ctx.db
      .query("recipeBooks")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();
    if (!recipeBook)
      return createBadResponse(
        HttpResponseCode.NotFound,
        "Recipe book not found"
      );

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
          q.eq(q.field("recipeBookId"), args.id)
        )
      )
      .unique();
    if (!userRecipeBookRelationship)
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "No permission to view recipe book"
      );

    if (
      args.checkPrivilages &&
      userRecipeBookRelationship.privilage === Privilage.Viewer
    ) {
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "You don't have access to edit this recipe book."
      );
    }

    return createOKResponse({
      ...recipeBook,
      privilage: userRecipeBookRelationship.privilage as Privilage,
    });
  },
});

export const getRecipeBooks = query({
  args: {},
  handler: async (ctx, args) => {
    const userEntityResponse = await getLoggedUser(ctx, args);
    if (!userEntityResponse.data)
      return createBadResponse(
        userEntityResponse.status,
        userEntityResponse.errorMessage
      );

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

    //return recipeBookListWithPrivilage ?? [];
    return createOKResponse(recipeBookListWithPrivilage ?? []);
  },
});

export const getRecipebookSharedUsers = query({
  args: {
    recipeBookId: v.id("recipeBooks"),
  },
  handler: async (ctx, args) => {
    const userConvexResponse = await getLoggedUser(ctx, args);
    if (!userConvexResponse.data)
      return createBadResponse(
        userConvexResponse.status,
        userConvexResponse.errorMessage
      );

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
      .filter((q) => q.neq(q.field("_id"), userConvexResponse.data!._id))
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

    return createOKResponse(userListResponse);
  },
});

// Mutations -----------------------------------------

export const createRecipeBook = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(
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

    const newRecipeBookId = await ctx.db.insert("recipeBooks", {
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
    });
    if (!newRecipeBookId) {
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Recipe book was not created - Not able to insert into database."
      );
    }

    const userRecipeBookRelationship = await ctx.db.insert(
      "userRecipeBookRelationship",
      {
        userId: userResponse.data._id,
        recipeBookId: newRecipeBookId,
        privilage: Privilage.Owner,
      }
    );
    if (!userRecipeBookRelationship) {
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Recipe book user relation was not created - Relation was not able to be inserted to database."
      );
    }

    return createOKResponse({
      recipeBookId: newRecipeBookId,
    });
  },
});
// TODO: Implement soft delete for users that have shared recipe book and want to remove it from list -> remove record from userRecipeBookRelationship
export const deleteRecipeBook = mutation({
  args: {
    id: v.id("recipeBooks"),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    // TODO: Change behavior according to privilages

    const recipeBook = await ctx.db.get(args.id);
    if (!recipeBook) {
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Recipe book was not deleted."
      );
    }

    // Delete image from storage
    if (recipeBook.coverImage?.storageId)
      await ctx.storage.delete(recipeBook.coverImage.storageId);

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

    await ctx.db.delete(args.id);
    return createOKResponse(true);
  },
});

export const updateRecipeBook = mutation({
  args: {
    id: v.id("recipeBooks"),
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(
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

    const recipeBook = await ctx.db.get(args.id);
    if (!recipeBook) {
      return createBadResponse(
        HttpResponseCode.NotFound,
        "Cannot update because Recipe book was not found"
      );
    }

    // Delete previous image if image changes
    if (
      recipeBook.coverImage?.storageId &&
      recipeBook.coverImage?.imageUrl !== args.coverImage?.imageUrl
    ) {
      await ctx.storage.delete(recipeBook.coverImage.storageId);
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
    });
    return createOKResponse(true);
  },
});

export const addAccessToRecipeBook = mutation({
  args: {
    email: v.string(),
    privilage: v.string(),
    recipeBookId: v.id("recipeBooks"),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const emailUserEntity = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    if (!emailUserEntity) {
      return createBadResponse(
        HttpResponseCode.NotFound,
        "Cannot add access to user that is not registered yet"
      );
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
      return createBadResponse(
        HttpResponseCode.Conflict,
        "User already has access to this recipe book"
      );
    }

    const insertResult = await ctx.db.insert("userRecipeBookRelationship", {
      userId: emailUserEntity._id,
      recipeBookId: args.recipeBookId,
      privilage: args.privilage,
    });
    if (!insertResult)
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Error when trying to add access to database."
      );

    return createOKResponse({
      relationId: insertResult,
    });
  },
});
export const changeAccessToRecipeBook = mutation({
  args: {
    relationShipId: v.id("userRecipeBookRelationship"),
    privilage: v.string(),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const relationship = await ctx.db.get(args.relationShipId);

    if (!relationship) {
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "User does not have access to recipe book yet."
      );
    }

    await ctx.db.patch(relationship._id, {
      privilage: args.privilage,
    });

    return createOKResponse(true);
  },
});
export const revokeAccessToRecipeBook = mutation({
  args: {
    relationShipId: v.id("userRecipeBookRelationship"),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const relationship = await ctx.db.get(args.relationShipId);

    if (!relationship) {
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "User does not have access to recipe book yet."
      );
    }

    await ctx.db.delete(args.relationShipId);

    return createOKResponse(true);
  },
});
