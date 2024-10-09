"use client";
import { getRecipeById } from "@/convex/recipes";
import { FormMethods, ImageInputHandle } from "@/types";
import React, { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PrivilageBadge from "@/components/users/PrivilageBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageInput from "@/components/global/ImageInput";
import Editor from "@/components/editor/Editor";
interface RecipeDetailHeaderProps {
  recipe?: Awaited<ReturnType<typeof getRecipeById>>;
}

interface CustomFormContext {
  coverImageRef: React.RefObject<ImageInputHandle>;
  recipeImageRef?: React.RefObject<ImageInputHandle>;
}

const UpdateRecipeForm = ({ recipe }: RecipeDetailHeaderProps) => {
  const { register, coverImageRef } = useFormContext() as ReturnType<
    typeof useFormContext
  > &
    CustomFormContext;

  // if (!recipe || !recipe.data) return <></>;

  return (
    <div className="w-full">
      {recipe && recipe.data && (
        <div className="flex justify-end">
          {recipe.data && <PrivilageBadge privilage={recipe.data.privilage} />}
        </div>
      )}
      <div className="flex flex-col gap-[30px] pb-6 w-full">
        <div className="flex flex-col md:flex-row gap-[30px] w-full">
          <div className="flex flex-col gap-[30px] flex-auto">
            <FormField
              {...{ ...register("name"), ref: null }}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-16 font-bold text-accent">
                    Name*
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                      placeholder="Recipe book name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-primary" />
                </FormItem>
              )}
            />
            <FormField
              {...{ ...register("description"), ref: null }}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-16 font-bold text-accent">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                      placeholder="Optional recipe book description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-primary" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-auto md:max-w-[50%] flex-col">
            <FormField
              {...{ ...register("image"), ref: null }}
              render={({ field }) => (
                <ImageInput
                  image={field.value}
                  setImage={(newImage) => {
                    field.onChange(newImage);
                  }}
                  ref={coverImageRef}
                />
              )}
            />
          </div>
        </div>
        <FormField
          {...{ ...register("ingredients"), ref: null }}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-16 font-bold text-accent">
                Ingredients
              </FormLabel>
              <FormControl>
                <Editor name={field.name} value={field.value} />
              </FormControl>
              <FormMessage className="text-primary" />
            </FormItem>
          )}
        />
        <FormField
          {...{ ...register("recipe"), ref: null }}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-16 font-bold text-accent">
                Recipe*
              </FormLabel>
              <FormControl>
                <Editor name={field.name} value={field.value} />
              </FormControl>
              <FormMessage className="text-primary" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
export default UpdateRecipeForm;
