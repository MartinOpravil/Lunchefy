import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
    isVerified: v.boolean(),
  }),
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(
      v.object({
        imageUrl: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        externalUrl: v.optional(v.string()),
      }),
    ),
  }),
  userGroupRelationship: defineTable({
    userId: v.id("users"),
    groupId: v.id("groups"),
    privilage: v.string(),
  }),
  groupPlans: defineTable({
    date: v.string(),
    groupId: v.id("groups"),
    recipeId: v.id("recipes"),
  }),
  recipes: defineTable({
    lastChange: v.optional(
      v.object({
        date: v.number(),
        authorId: v.string(),
      }),
    ),
    groupId: v.id("groups"),
    name: v.string(),
    nameNormalized: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(
      v.object({
        imageUrl: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        externalUrl: v.optional(v.string()),
      }),
    ),
    isImageRecipe: v.boolean(),
    tags: v.optional(v.string()),
    ingredients: v.optional(v.string()),
    instructions: v.optional(v.string()),
    recipeImage: v.optional(
      v.object({
        imageUrl: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        externalUrl: v.optional(v.string()),
      }),
    ),
    plannerDate: v.optional(v.number()),
  })
    .index("by_planner_date", ["plannerDate", "nameNormalized"])
    .index("by_normalized_name", ["nameNormalized"])
    .searchIndex("nameSearch", {
      searchField: "nameNormalized",
    })
    .searchIndex("tagSearch", {
      searchField: "tags",
    }),
});
