import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    //imageStorageId: v.optional(v.id("_storage")),
    clerkId: v.string(),
    name: v.string(),
    //recipeBookIdList: v.optional(v.array(v.id("recipeBooks"))), // DELETE
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
    // imageUrl: v.optional(v.string()),
    //recipeIdList: v.array(v.id("recipes")),
    image: v.optional(
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
    image: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
    tags: v.array(v.id("tags")),
    ingredients: v.string(),
    recipe: v.string(),
    recipePhoto: v.optional(
      v.object({
        imageUrl: v.string(),
        storageId: v.optional(v.id("_storage")),
      })
    ),
  })
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_tags", { searchField: "tags" }),
  tags: defineTable({
    name: v.string(),
    icon: v.string(),
  }),
});
