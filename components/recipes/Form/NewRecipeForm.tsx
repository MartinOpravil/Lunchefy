"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../ui/input";
import ImageInput from "../../global/ImageInput";
import ActionButton from "../../global/ActionButton";
import { Textarea } from "@/components/ui/textarea";
import { ButtonVariant } from "@/enums";
import { Save } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe name must be at least 2 characters.",
  }),
  description: z.optional(z.string()),
  ingredients: z.optional(z.string()),
  recipe: z.string().min(2, {
    message: "Recipe must be at least 2 characters.",
  }),
});

interface NewRecipeBookForm {
  recipeBookId: Id<"recipeBooks">;
  afterSaveAction: () => void;
}

const NewRecipeForm = ({
  recipeBookId,
  afterSaveAction,
}: NewRecipeBookForm) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createRecipe = useMutation(api.recipes.createRecipe);
  const imageInputRef = useRef<ImageInputHandle>(null);
  const [image, setImage] = useState<ImageStateProps | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      ingredients: "",
      recipe: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const updatedImage = await imageInputRef.current?.commit();
      const response = await createRecipe({
        recipeBookId,
        name: values.name,
        description: values.description,
        ingredients: values.ingredients,
        recipe: values.recipe,
        image: updatedImage ?? image,
      });
      setIsSubmitting(false);
      if (response.data) {
        notifySuccess("Recipe book successfully created.");
        afterSaveAction();
        return;
      }
      notifyError(response.status.toString(), response.errorMessage);
    } catch (error) {
      console.log("Error creating recipe book", error);
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
        <div className="flex flex-col gap-[30px] pb-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-16 font-bold text-accent">
                  Name*
                </FormLabel>
                <FormControl>
                  <Input
                    className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                    placeholder="Recipe name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-16 font-bold text-accent">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                    placeholder="Optional recipe description"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
          <ImageInput image={image} setImage={setImage} ref={imageInputRef} />
          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-16 font-bold text-accent">
                  Ingredients
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                    placeholder="Insert ingredients, preferably by using bullets"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipe"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-16 font-bold text-accent">
                  Recipe*
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                    placeholder="Recipe"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col items-center">
          <ActionButton
            title="Save"
            icon={<Save />}
            variant={ButtonVariant.Positive}
            isLoading={isSubmitting}
            classList="min-w-48"
            isDisabled={!form.formState.isDirty}
            onClick={form.handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </Form>
  );
};

export default NewRecipeForm;
