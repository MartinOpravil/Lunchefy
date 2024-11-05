"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useFormContext } from "react-hook-form";
import ImageInput from "@/components/global/ImageInput";
import { ImageInputHandle } from "@/types";
import PrivilageBadge from "@/components/users/PrivilageBadge";
import { getRecipeBookById } from "@/convex/recipeBooks";
import { Textarea } from "@/components/ui/textarea";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

interface RecipeBookDetailPageHeaderProps {
  recipeBook?: Awaited<ReturnType<typeof getRecipeBookById>>;
}

interface CustomFormContext {
  coverImageRef: React.RefObject<ImageInputHandle>;
}

const RecipeBookForm = ({ recipeBook }: RecipeBookDetailPageHeaderProps) => {
  const { register, coverImageRef } = useFormContext() as ReturnType<
    typeof useFormContext
  > &
    CustomFormContext;

  // if (!recipeBook.data) return <></>;

  return (
    <div className="w-full">
      <div className="flex justify-end">
        {recipeBook && recipeBook.data && (
          <PrivilageBadge privilage={recipeBook.data.privilage} />
        )}
      </div>
      <div className="flex flex-col gap-[30px] pb-6">
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
                <AutosizeTextarea
                  className="input-class border-2 border-accent focus-visible:ring-secondary transition"
                  placeholder="Optional recipe book description"
                  {...field}
                  maxHeight={200}
                />
                {/* <Textarea
                  className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                  placeholder="Optional recipe book description"
                  {...field}
                /> */}
              </FormControl>
              <FormMessage className="text-primary" />
            </FormItem>
          )}
        />
      </div>
      <FormField
        {...{ ...register("coverImage"), ref: null }}
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
  );
};

export default RecipeBookForm;
