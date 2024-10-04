"use client";
import { api } from "@/convex/_generated/api";
import { getRecipeById } from "@/convex/recipes";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { FormRef, ImageInputHandle, ImageStateProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PrivilageBadge from "@/components/users/PrivilageBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageInput from "@/components/global/ImageInput";
import ActionButton from "@/components/global/ActionButton";
import Editor from "@/components/editor/Editor";
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

interface RecipeDetailHeaderProps {
  recipe: Awaited<ReturnType<typeof getRecipeById>>;
}

const UpdateRecipeForm = forwardRef<FormRef, RecipeDetailHeaderProps>(
  ({ recipe }, ref) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const updateRecipe = useMutation(api.recipes.updateRecipe);
    const imageInputRef = useRef<ImageInputHandle>(null);
    const [image, setImage] = useState<ImageStateProps | undefined>(
      recipe.data?.image
    );

    useImperativeHandle(ref, () => ({
      save() {
        form.handleSubmit(onSubmit)();
      },
      isSubmitting,
    }));

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: recipe.data?.name ?? "",
        description: recipe.data?.description ?? "",
        ingredients: recipe.data?.ingredients ?? "",
        recipe: recipe.data?.recipe ?? "",
      },
      values: {
        name: recipe.data?.name ?? "",
        description: recipe.data?.description ?? "",
        ingredients: recipe.data?.ingredients ?? "",
        recipe: recipe.data?.recipe ?? "",
      },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
      if (!recipe.data) return;

      setIsSubmitting(true);

      try {
        const updatedImage = await imageInputRef.current?.commit();
        const response = await updateRecipe({
          id: recipe.data?._id,
          name: values.name,
          description: values.description,
          image: updatedImage ?? image,
          ingredients: values.ingredients,
          recipe: values.recipe,
        });
        setIsSubmitting(false);

        if (!response.data)
          return notifyError(response.status.toString(), response.errorMessage);
        notifySuccess("Successfully updated recipe");

        router.push(`/app/${recipe.data.recipeBookId}/${recipe.data._id}`);
        router.refresh();
      } catch (error) {
        console.log("Error updating recipe", error);
        setIsSubmitting(false);
      }
    }

    if (!recipe.data) return <></>;

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          <div className="flex justify-end">
            {recipe.data && (
              <PrivilageBadge privilage={recipe.data.privilage} />
            )}
          </div>
          <div className="flex flex-col gap-[30px] pb-6 w-full">
            <div className="flex flex-col md:flex-row gap-[30px] w-full">
              <div className="flex flex-col gap-[30px] flex-auto">
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
                          placeholder="Recipe book name"
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
                          placeholder="Optional recipe book description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-primary" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-auto md:max-w-[50%]">
                <ImageInput
                  image={image}
                  setImage={setImage}
                  ref={imageInputRef}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-16 font-bold text-accent">
                    Ingredients
                  </FormLabel>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onContentChange={(value: string) =>
                        form.setValue("ingredients", value)
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-primary" />
                </FormItem>
              )}
            />
            {/* <FormField
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
          /> */}
            <FormField
              control={form.control}
              name="recipe"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-16 font-bold text-accent">
                    Recipe*
                  </FormLabel>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onContentChange={(value: string) =>
                        form.setValue("recipe", value)
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-primary" />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    );
  }
);
UpdateRecipeForm.displayName = "UpdateRecipeForm";
export default UpdateRecipeForm;
