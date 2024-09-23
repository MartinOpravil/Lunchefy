"use client";
import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";

import { useForm } from "react-hook-form";
import ActionButton from "@/components/global/ActionButton";
import { useRouter } from "next/navigation";
import ImageInput from "@/components/global/ImageInput";
import { ImageInputHandle } from "@/types";
import Image from "next/image";
import PrivilageBadge from "@/components/users/PrivilageBadge";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { getRecipeBookById } from "@/convex/recipeBooks";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe book name must be at least 2 characters.",
  }),
  description: z.optional(z.string()),
});

interface RecipeBookDetailPageHeaderProps {
  recipeBook: Awaited<ReturnType<typeof getRecipeBookById>>;
}

const RecipeBookDetailForm = ({
  recipeBook,
}: RecipeBookDetailPageHeaderProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateRecipeBook = useMutation(api.recipeBooks.updateRecipeBook);
  const [image, setImage] = useState(recipeBook.data?.image);
  const imageInputRef = useRef<ImageInputHandle>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: recipeBook.data?.name ?? "",
      description: recipeBook.data?.description ?? "",
    },
    values: {
      name: recipeBook.data?.name ?? "",
      description: recipeBook.data?.description ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!recipeBook.data) return;

    setIsSubmitting(true);

    try {
      const updatedImage = await imageInputRef.current?.commit();
      const response = await updateRecipeBook({
        id: recipeBook.data?._id,
        name: values.name,
        description: values.description,
        image: updatedImage ?? image,
      });
      setIsSubmitting(false);

      if (!response.data)
        return notifyError(response.status.toString(), response.errorMessage);
      notifySuccess("Successfully updated recipe book");

      router.push("/app");
      router.refresh();
    } catch (error) {
      console.log("Error updating recipe book", error);
      setIsSubmitting(false);
    }
  }

  if (!recipeBook.data) return <></>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
        <div className="flex justify-end">
          {recipeBook.data && (
            <PrivilageBadge privilage={recipeBook.data.privilage} />
          )}
        </div>
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

        <ImageInput image={image} setImage={setImage} ref={imageInputRef} />

        <div className="flex flex-col items-center">
          <ActionButton
            title="Save"
            icon="save"
            isLoading={isSubmitting}
            isDisabled={!form.formState.isDirty}
            classList="min-w-32"
            onClick={form.handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </Form>
  );
};

export default RecipeBookDetailForm;
