import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    clerkId: v.string(),
    name: v.string(),
    collectionIdList: v.array(v.id("collections")),
    appSettings: v.object({
      colors: v.object({
        background: v.string(),
        font: v.string(),
      }),
      language: v.string(),
    }),
  }),
  collections: defineTable({
    name: v.string(),
    recipeIdList: v.array(v.id("recipes")),
  }),
  userCollectionRelationShip: defineTable({
    userId: v.id("users"),
    collectionId: v.id("collections"),
    privilage: v.string(),
  }),
  recipes: defineTable({
    name: v.string(),
    picture: v.string(),
    tags: v.array(v.id("tags")),
    ingredients: v.string(),
    recipe: v.string(),
  })
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_tags", { searchField: "tags" }),
  tags: defineTable({
    name: v.string(),
    icon: v.string(),
  }),
});
