import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { HttpResponseCode, Privilage } from "@/enums";
import { filter } from "convex-helpers/server/filter";
import { Doc } from "./_generated/dataModel";
import { createBadResponse, createOKResponse } from "@/lib/communication";
import { getLoggedUser } from "./users";

// QUERIES -------------------------------------------
// TODO: Check if I can use id of group directly instead of generic string
export const getGroupById = query({
  args: { id: v.string(), checkPrivilages: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const group = await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();
    if (!group)
      return createBadResponse(HttpResponseCode.NotFound, "Group not found");

    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(
        userResponse.status,
        userResponse.errorMessage ?? ""
      );

    const userGroupRelationship = await ctx.db
      .query("userGroupRelationship")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userResponse.data!._id),
          q.eq(q.field("groupId"), args.id)
        )
      )
      .unique();
    if (!userGroupRelationship)
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "No permission to view group"
      );

    if (
      args.checkPrivilages &&
      userGroupRelationship.privilage === Privilage.Viewer
    ) {
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "You don't have access to edit this group."
      );
    }

    return createOKResponse({
      ...group,
      privilage: userGroupRelationship.privilage as Privilage,
      isVerified: userResponse.data.isVerified,
    });
  },
});

export const getGroupList = query({
  args: {},
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const userGroupRelationshipList = await ctx.db
      .query("userGroupRelationship")
      .filter((q) =>
        q.eq(q.field("userId"), (userResponse.data as Doc<"users">)._id)
      )
      .collect();
    const groupIdList = userGroupRelationshipList.map(
      (relation) => relation.groupId
    );
    const groupList = await filter(ctx.db.query("groups"), (group) =>
      groupIdList.includes(group._id)
    )
      .order("desc")
      .collect();

    const groupListWithPrivilage = groupList.map((group) => {
      const privilage = userGroupRelationshipList.find(
        (relation) => relation.groupId === group._id
      )?.privilage as string;
      return {
        ...group,
        privilage: privilage as Privilage,
        isVerified: userResponse.data?.isVerified ?? false,
      };
    });

    return createOKResponse(groupListWithPrivilage ?? []);
  },
});

export const getGroupSharedUsers = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const userGroupRelationshipList = await ctx.db
      .query("userGroupRelationship")
      .filter((q) => q.eq(q.field("groupId"), args.groupId))
      .collect();

    const userIdList = userGroupRelationshipList.map(
      (relation) => relation.userId
    );
    const userList = await filter(ctx.db.query("users"), (user) =>
      userIdList.includes(user._id)
    )
      .filter((q) => q.neq(q.field("_id"), userResponse.data!._id))
      .order("desc")
      .collect();

    const userListResponse = userList.map((user) => {
      const relationship = userGroupRelationshipList.find(
        (relation) => relation.userId === user._id
      );
      return {
        relationshipId: relationship!._id,
        name: user.name,
        email: user.email,
        privilage: relationship?.privilage as Privilage,
        isVerified: userResponse.data?.isVerified ?? false,
      };
    });

    return createOKResponse(userListResponse);
  },
});

// Mutations -----------------------------------------

export const createGroup = mutation({
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

    const newGroupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
    });
    if (!newGroupId) {
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Group was not created - Not able to insert into database."
      );
    }

    const userGroupRelationship = await ctx.db.insert("userGroupRelationship", {
      userId: userResponse.data._id,
      groupId: newGroupId,
      privilage: Privilage.Owner,
    });
    if (!userGroupRelationship) {
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "User-Group relation was not created - Relation was not able to be inserted to database."
      );
    }

    return createOKResponse({
      groupId: newGroupId,
    });
  },
});
// TODO: Implement soft delete for users that have shared group and want to remove it from list -> remove record from userGroupRelationship
export const deleteGroup = mutation({
  args: {
    id: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    // TODO: Change behavior according to privilages

    const group = await ctx.db.get(args.id);
    if (!group) {
      return createBadResponse(
        HttpResponseCode.InternalServerError,
        "Group was not deleted."
      );
    }

    // Delete image from storage
    if (group.coverImage?.storageId)
      await ctx.storage.delete(group.coverImage.storageId);

    // Delete all relationsips
    const relationship = await ctx.db
      .query("userGroupRelationship")
      .filter((q) => q.eq(q.field("groupId"), group._id))
      .collect();
    await Promise.all(
      relationship.map(async (r) => {
        ctx.db.delete(r._id);
      })
    );
    // Delete all plans
    const planList = await ctx.db
      .query("groupPlans")
      .filter((q) => q.eq(q.field("groupId"), group._id))
      .collect();
    await Promise.all(
      planList.map(async (p) => {
        ctx.db.delete(p._id);
      })
    );

    await ctx.db.delete(args.id);
    return createOKResponse(true);
  },
});

export const updateGroup = mutation({
  args: {
    id: v.id("groups"),
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

    const group = await ctx.db.get(args.id);
    if (!group) {
      return createBadResponse(
        HttpResponseCode.NotFound,
        "Cannot update because Group was not found"
      );
    }

    // Delete previous image if image changes
    if (
      group.coverImage?.storageId &&
      group.coverImage?.imageUrl !== args.coverImage?.imageUrl
    ) {
      await ctx.storage.delete(group.coverImage.storageId);
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
    });
    return createOKResponse(true);
  },
});

export const addAccessToGroup = mutation({
  args: {
    email: v.string(),
    privilage: v.string(),
    groupId: v.id("groups"),
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

    const userGroupRelationshipList = await ctx.db
      .query("userGroupRelationship")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), emailUserEntity._id),
          q.eq(q.field("groupId"), args.groupId)
        )
      )
      .collect();

    if (userGroupRelationshipList.length) {
      return createBadResponse(
        HttpResponseCode.Conflict,
        "User already has access to this group"
      );
    }

    const insertResult = await ctx.db.insert("userGroupRelationship", {
      userId: emailUserEntity._id,
      groupId: args.groupId,
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
export const changeAccessToGroup = mutation({
  args: {
    relationshipId: v.id("userGroupRelationship"),
    privilage: v.string(),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const relationship = await ctx.db.get(args.relationshipId);

    if (!relationship) {
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "User does not have access to this group yet."
      );
    }

    await ctx.db.patch(relationship._id, {
      privilage: args.privilage,
    });

    return createOKResponse(true);
  },
});
export const revokeAccessToGroup = mutation({
  args: {
    relationshipId: v.id("userGroupRelationship"),
  },
  handler: async (ctx, args) => {
    const userResponse = await getLoggedUser(ctx, args);
    if (!userResponse.data)
      return createBadResponse(userResponse.status, userResponse.errorMessage);

    const relationship = await ctx.db.get(args.relationshipId);

    if (!relationship) {
      return createBadResponse(
        HttpResponseCode.Forbidden,
        "User does not have access to this group yet."
      );
    }

    await ctx.db.delete(args.relationshipId);

    return createOKResponse(true);
  },
});
