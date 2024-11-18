import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
    appSettings: v.object({
      colors: v.object({
        background: v.string(),
        font: v.string(),
      }),
      language: v.string(),
    }),
  }),
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
  }),
  userGroupRelationship: defineTable({
    userId: v.id("users"),
    groupId: v.id("groups"),
    privilage: v.string(),
  }),
  plannedGroupRecipes: defineTable({
    date: v.string(),
    groupId: v.id("groups"),
    recipeId: v.id("recipes"),
  }),
  recipes: defineTable({
    groupId: v.id("groups"),
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
    isImageRecipe: v.boolean(),
    tags: v.optional(v.array(v.string())),
    ingredients: v.optional(v.string()),
    instructions: v.optional(v.string()),
    recipeImage: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
  }).searchIndex("search_name_tags", {
    searchField: "name",
    filterFields: ["tags"],
  }),
});
