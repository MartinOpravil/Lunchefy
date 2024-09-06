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
import { createRecipeBook } from "@/convex/recipeBooks";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe book name must be at least 2 characters.",
  }),
});

const NewRecipeBookPage = () => {
  const router = useRouter();
  const [isSumbitting, setIsSumbitting] = useState(false);
  const createRecipeBook = useMutation(api.recipeBooks.createRecipeBook);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSumbitting(true);

    try {
      const newRecipeBookId = await createRecipeBook({
        name: values.name,
      });
      console.log(newRecipeBookId);
      if (newRecipeBookId) router.push("/app");
    } catch (error) {
      console.log("Error creating recipe book", error);
    }

    setIsSumbitting(false);
  }

  return (
    <main className="flex flex-col py-6 h-[calc(100vh-72.4px)]">
      <PageHeader
        title="New recipe book"
        icon="recipe_book"
        actionButton={<LinkButton title="Back" href="/app" />}
      />
      <main className="pt-6">
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

            <div className="flex flex-col items-center">
              <ActionButton
                title="Save"
                isLoading={false}
                classList="min-w-32"
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
