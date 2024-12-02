"use client";
import { getRecipeById } from "@/convex/recipes";
import { ImageInputHandle } from "@/types";
import React from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileImage, FileText, Image as ImageLucide, Text } from "lucide-react";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import MultipleSelector from "@/components/ui/multiple-selector";
import { useTranslations } from "next-intl";
import { useTagManager } from "../TagManager";

interface RecipeDetailHeaderProps {
  recipe?: Awaited<ReturnType<typeof getRecipeById>>;
  isVerified: boolean;
}

interface CustomFormContext {
  coverImageRef: React.RefObject<ImageInputHandle>;
  recipeImageRef?: React.RefObject<ImageInputHandle>;
}

const RecipeForm = ({ recipe, isVerified }: RecipeDetailHeaderProps) => {
  const t = useTranslations();
  const { register, setValue, coverImageRef, recipeImageRef } =
    useFormContext() as ReturnType<typeof useFormContext> & CustomFormContext;

  const { tagOptions } = useTagManager();
  // if (!recipe || !recipe.data) return <></>;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 pb-6 w-full">
        <section className="bg-primary/20 p-3 rounded flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <h3 className="text-accent pb-2">General</h3>
            {recipe && recipe.data && (
              <div className="flex justify-center items-center">
                {recipe.data && (
                  <PrivilageBadge privilage={recipe.data.privilage} />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-[30px] w-full">
            <div className="flex flex-col gap-[30px] flex-auto">
              <FormField
                {...{ ...register("name"), ref: null }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-16 font-bold text-accent">
                      {t("Recipes.General.Form.Property.Name")}*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                        placeholder={t("Recipes.General.Form.Placeholder.Name")}
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
                      {t("Recipes.General.Form.Property.Description")}
                    </FormLabel>
                    <FormControl>
                      <AutosizeTextarea
                        className="input-class border-2 border-accent focus-visible:ring-secondary transition"
                        placeholder={t(
                          "Recipes.General.Form.Placeholder.Description"
                        )}
                        {...field}
                        maxHeight={200}
                      />
                    </FormControl>
                    <FormMessage className="text-primary" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-auto md:max-w-[50%] flex-col">
              <FormField
                {...{ ...register("coverImage"), ref: null }}
                render={({ field }) => (
                  <ImageInput
                    label={t("Recipes.General.Form.Property.CoverImage")}
                    image={field.value}
                    setImage={(newImage) => {
                      field.onChange(newImage);
                    }}
                    ref={coverImageRef}
                    isVerified={isVerified}
                  />
                )}
              />
            </div>
          </div>
          <FormField
            {...{ ...register("tags"), ref: null }}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-16 font-bold text-accent">
                  {t("Recipes.General.Form.Property.Tags")}
                </FormLabel>
                <FormControl>
                  <MultipleSelector
                    className="input-class border-2 border-accent focus-visible:ring-secondary transition"
                    options={tagOptions}
                    placeholder={t("Recipes.General.Form.Placeholder.Tags")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
        </section>
        <Tabs
          defaultValue={recipe?.data?.isImageRecipe.toString() ?? "false"}
          className="bg-accent/20 p-3 rounded"
        >
          <h3 className="text-accent pb-2">Recipe</h3>
          <TabsList className="w-full mb-4 flex flex-col sm:flex-row">
            <TabsTrigger
              value="false"
              className="flex gap-2 w-full"
              onClick={() =>
                setValue("isImageRecipe", false, { shouldDirty: true })
              }
            >
              <FileText />
              {t("Recipes.General.Form.Property.UseText")}
            </TabsTrigger>
            <TabsTrigger
              value="true"
              className="flex gap-2 w-full"
              onClick={() =>
                setValue("isImageRecipe", true, { shouldDirty: true })
              }
            >
              <FileImage />
              {t("Recipes.General.Form.Property.UseImage")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="false">
            <div className="flex flex-col gap-[30px]">
              {recipe?.data?.recipeImage && (
                <div className="text-12 text-primary text-center">
                  {t("Recipes.General.ImageDeletionDisclaimer")}
                </div>
              )}
              <FormField
                {...{ ...register("ingredients"), ref: null }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-16 font-bold text-accent">
                      {t("Recipes.General.Form.Property.Ingredients")}
                    </FormLabel>
                    <FormControl>
                      <Editor name={field.name} value={field.value} />
                    </FormControl>
                    <FormMessage className="text-primary" />
                  </FormItem>
                )}
              />
              <FormField
                {...{ ...register("instructions"), ref: null }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-16 font-bold text-accent">
                      {t("Recipes.General.Form.Property.Instructions")}
                    </FormLabel>
                    <FormControl>
                      <Editor name={field.name} value={field.value} />
                    </FormControl>
                    <FormMessage className="text-primary" />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value="true">
            <FormField
              {...{ ...register("recipeImage"), ref: null }}
              render={({ field }) => (
                <ImageInput
                  label={t("Recipes.General.Form.Property.RecipeImage")}
                  image={field.value}
                  setImage={(newImage) => {
                    field.onChange(newImage);
                  }}
                  ref={recipeImageRef}
                  isVerified={isVerified}
                />
              )}
            />
          </TabsContent>
        </Tabs>
        <div className="flex flex-col md:flex-row gap-[30px] w-full"></div>
      </div>
    </div>
  );
};
export default RecipeForm;
