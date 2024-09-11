"use client";
import ActionButton from "@/components/global/ActionButton";
import Image from "next/image";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { AccessManagerProps } from "@/types";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpiner from "@/components/global/LoaderSpinner";
import PrivilageBadge from "@/components/users/PrivilageBadge";
import BasicDialog from "@/components/global/BasicDialog";
import UserWithAccess from "./UserWithAccess";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

const AccessManager = ({
  recipeBookName,
  recipeBookId,
}: AccessManagerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const addAccessToRecipeBook = useMutation(
    api.recipeBooks.addAccessToRecipeBook
  );
  const recipebookSharedUsers = useQuery(
    api.recipeBooks.getRecipebookSharedUsers,
    { recipeBookId }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const result = await addAccessToRecipeBook({
        email: values.email,
        recipeBookId: recipeBookId,
      });
      setIsSubmitting(false);
      if (!result) return;

      form.setValue("email", "");
      setIsFormOpen(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="access-manager w-full transition-all">
      {!isFormOpen && (
        <>
          <div className="flex flex-col">
            <ActionButton
              title="Share with user"
              icon="share"
              isLoading={isSubmitting}
              classList="min-w-32"
              onClick={() => setIsFormOpen(true)}
            />
          </div>
          <div className="access-manager-list pt-6 w-full">
            {recipebookSharedUsers ? (
              <>
                <h3 className="text-16 text-accent">Users with access:</h3>
                {recipebookSharedUsers.map((user, index) => (
                  <UserWithAccess
                    key={index}
                    name={user.name}
                    email={user.email}
                    privilage={user.privilage}
                    relationShipId={user.relationshipId}
                  />
                ))}
              </>
            ) : (
              <LoaderSpiner />
            )}
          </div>
        </>
      )}

      {isFormOpen && (
        <div className="access-manager-form">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col"
            >
              <div className="flex flex-col gap-[30px] pb-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-16 font-bold text-accent">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                          placeholder={`Email to share "${recipeBookName}" with`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-primary" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center gap-2">
                <ActionButton
                  title="Cancel"
                  onClick={() => setIsFormOpen(false)}
                />
                <ActionButton
                  title="Share"
                  icon="share"
                  isLoading={isSubmitting}
                  classList="min-w-32"
                  onClick={form.handleSubmit(onSubmit)}
                />
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AccessManager;
