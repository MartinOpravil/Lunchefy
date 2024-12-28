import { z } from "zod";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const groupFormSchema = z.object({
  name: z.string().min(2, {
    message: "",
  }),
  description: z.optional(z.string()),
  coverImage: z.optional(
    z.object({
      imageUrl: z.optional(z.string()),
      storageId: z.optional(z.string()),
      externalUrl: z.optional(z.string()),
    })
  ),
});
export type GroupFormValues = z.infer<typeof groupFormSchema>;

export const recipeFormSchema = z.object({
  name: z.string().min(2, {
    message: "",
  }),
  description: z.optional(z.string()),
  ingredients: z.optional(z.string()),
  instructions: z.optional(z.string()),
  coverImage: z.optional(
    z.object({
      imageUrl: z.optional(z.string()),
      storageId: z.optional(z.string()),
      externalUrl: z.optional(z.string()),
    })
  ),
  tags: z.optional(z.array(optionSchema)),
  isImageRecipe: z.boolean(),
  recipeImage: z.optional(
    z.object({
      imageUrl: z.optional(z.string()),
      storageId: z.optional(z.string()),
      externalUrl: z.optional(z.string()),
    })
  ),
});
export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
