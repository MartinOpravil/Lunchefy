"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import PageHeader from "@/components/global/PageHeader";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
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
import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import ImageInput from "@/components/global/ImageInput";
import { ImageStateProps } from "@/types";
import { notifyError, notifySuccess } from "@/lib/notifications";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe book name must be at least 2 characters.",
  }),
  description: z.optional(z.string()),
});

const NewRecipeBookPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createRecipeBook = useMutation(api.recipeBooks.createRecipeBook);

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
      const response = await createRecipeBook({
        name: values.name,
        description: values.description,
        image: image,
      });
      setIsSubmitting(false);
      if (response.data) {
        notifySuccess("Recipe book successfully created.");
        router.push("/app");
        return;
      }
      notifyError(response.status.toString(), response.errorMessage);
    } catch (error) {
      console.log("Error creating recipe book", error);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <PageHeader
        title="New recipe book"
        icon="recipe_book"
        actionButton={<LinkButton title="Back" icon="back" href="/app" />}
      />
      <main className="page-content">
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

            <ImageInput image={image} setImage={setImage} />

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
      </main>
    </main>
  );
};

export default NewRecipeBookPage;
