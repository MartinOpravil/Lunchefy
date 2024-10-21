import { z } from "zod";

export const recipeBookFormSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe book name must be at least 2 characters.",
  }),
  description: z.optional(z.string()),
  coverImage: z.optional(
    z.object({
      imageUrl: z.string(),
      storageId: z.optional(z.string()),
    })
  ),
});
export type RecipeBookFormValues = z.infer<typeof recipeBookFormSchema>;

export const recipeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe name must be at least 2 characters.",
  }),
  description: z.optional(z.string()),
  ingredients: z.optional(z.string()),
  instructions: z.optional(z.string()),
  coverImage: z.optional(
    z.object({
      imageUrl: z.string(),
      storageId: z.optional(z.string()),
    })
  ),
  isImageRecipe: z.boolean(),
  recipeImage: z.optional(
    z.object({
      imageUrl: z.string(),
      storageId: z.optional(z.string()),
    })
  ),
});
export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
