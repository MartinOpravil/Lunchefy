"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ActionButton from "@/components/global/ActionButton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ImageInput from "@/components/global/ImageInput";
import { ImageInputHandle, ImageStateProps } from "@/types";
import { notifyError, notifySuccess } from "@/lib/notifications";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe book name must be at least 2 characters.",
  }),
  description: z.optional(z.string()),
});

interface NewRecipeBookForm {
  afterSaveAction: () => void;
}

const NewRecipeBookForm = ({ afterSaveAction }: NewRecipeBookForm) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createRecipeBook = useMutation(api.recipeBooks.createRecipeBook);
  const imageInputRef = useRef<ImageInputHandle>(null);

  // const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<ImageStateProps | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const updatedImage = await imageInputRef.current?.commit();
      const response = await createRecipeBook({
        name: values.name,
        description: values.description,
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
                  <Input
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
            classList="min-w-48"
            isDisabled={!form.formState.isDirty}
            onClick={form.handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </Form>
  );
};

export default NewRecipeBookForm;
