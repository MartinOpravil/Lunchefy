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
  recipeBooks: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
  }),
  userRecipeBookRelationship: defineTable({
    userId: v.id("users"),
    recipeBookId: v.id("recipeBooks"),
    privilage: v.string(),
  }),
  recipes: defineTable({
    recipeBookId: v.id("recipeBooks"),
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
