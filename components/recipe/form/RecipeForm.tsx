"use client";

import { useFormContext } from "react-hook-form";

import { useTranslations } from "next-intl";

import { getRecipeById } from "@/convex/recipes";
import { FileImage, FileText, Image as ImageLucide, Text } from "lucide-react";

import ImageInput from "@/components/global/input/ImageInput";
import Editor from "@/components/recipe/editor/Editor";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrivilageBadge from "@/components/user/PrivilageBadge";

import { useTagManager } from "@/hooks/TagManager";
import { useGlobalStore } from "@/store/global";
import { ImageInputHandle } from "@/types";

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
  const { darkMode } = useGlobalStore();
  const { register, setValue, coverImageRef, recipeImageRef, getValues } =
    useFormContext() as ReturnType<typeof useFormContext> & CustomFormContext;

  const { tagOptions } = useTagManager();

  return (
    <div className="w-full max-w-[600px]">
      <div className="flex justify-end">
        {recipe && recipe.data && (
          <PrivilageBadge privilage={recipe.data.privilage} />
        )}
      </div>
      <div className="flex w-full flex-col gap-4 pb-6">
        <section className="flex flex-col gap-[30px]">
          <FormField
            {...{ ...register("name"), ref: null }}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="input-label">
                  {t("Recipes.General.Form.Property.Name")}*
                </FormLabel>
                <FormControl>
                  <Input
                    className="input-class"
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
                <FormLabel className="input-label">
                  {t("Recipes.General.Form.Property.Description")}
                </FormLabel>
                <FormControl>
                  <AutosizeTextarea
                    className="input-class"
                    placeholder={t(
                      "Recipes.General.Form.Placeholder.Description",
                    )}
                    {...field}
                    maxHeight={200}
                  />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />

          <FormField
            {...{ ...register("coverImage"), ref: null }}
            render={({ field }) => (
              <ImageInput
                label={t("Recipes.General.Form.Property.CoverImage")}
                image={getValues("coverImage")}
                setImage={(newImage) => {
                  field.onChange(newImage);
                }}
                ref={coverImageRef}
                isVerified={isVerified}
                formPropertyName="coverImage"
              />
            )}
          />
          <FormField
            {...{ ...register("tags"), ref: null }}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="input-label">
                  {t("Recipes.General.Form.Property.Tags")}
                </FormLabel>
                <FormControl>
                  <MultipleSelector
                    className="input-class transition"
                    options={tagOptions}
                    placeholder={t("Recipes.General.Form.Placeholder.Tags")}
                    hidePlaceholderWhenSelected
                    {...field}
                    groupBy="group"
                    darkMode={darkMode}
                  />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
        </section>
        <Tabs defaultValue={recipe?.data?.isImageRecipe.toString() ?? "false"}>
          <h3 className="input-label w-full pt-4 text-center">
            {t("Recipes.General.Content")}
          </h3>
          <TabsList className="my-6 flex w-full flex-col sm:flex-row">
            <TabsTrigger
              value="false"
              className="flex w-full gap-2 text-text"
              onMouseDown={() =>
                setValue("isImageRecipe", false, { shouldDirty: true })
              }
            >
              <FileText />
              {t("Recipes.General.Form.Property.UseText")}
            </TabsTrigger>
            <TabsTrigger
              value="true"
              className="flex w-full gap-2 text-text"
              onMouseDown={() =>
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
                <div className="text-12 text-center text-primary">
                  {t("Recipes.General.ImageDeletionDisclaimer")}
                </div>
              )}
              <FormField
                {...{ ...register("ingredients"), ref: null }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="input-label">
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
                    <FormLabel className="input-label">
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
                  image={getValues("recipeImage")}
                  setImage={(newImage) => {
                    field.onChange(newImage);
                  }}
                  ref={recipeImageRef}
                  isVerified={isVerified}
                  formPropertyName="recipeImage"
                />
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default RecipeForm;
