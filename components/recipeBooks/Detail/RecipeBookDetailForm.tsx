"use client";
import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import React, { useEffect, useState } from "react";
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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe book name must be at least 2 characters.",
  }),
});

const RecipeBookDetailForm = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
}) => {
  const recipeBookResult = usePreloadedQuery(props.recipeBookPreloaded);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateRecipeBook = useMutation(api.recipeBooks.updateRecipeBook);
  const [image, setImage] = useState(recipeBookResult?.image);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: recipeBookResult?.name ?? "",
    },
    values: {
      name: recipeBookResult?.name ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!recipeBookResult) return;

    setIsSubmitting(true);

    try {
      await updateRecipeBook({
        id: recipeBookResult?._id,
        name: values.name,
        image: image,
      });
      router.push("/app");
      router.refresh();
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error updating recipe book", error);
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
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                    placeholder="New recipe book name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
        </div>

        <ImageInput image={image} setImage={setImage} />

        <div className="flex flex-col items-center">
          <ActionButton
            title="Save"
            icon="save"
            isLoading={isSubmitting}
            classList="min-w-32"
            onClick={form.handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </Form>
  );
};

export default RecipeBookDetailForm;
