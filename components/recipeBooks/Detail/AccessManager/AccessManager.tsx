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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { AccessManagerProps } from "@/types";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpinner from "@/components/global/LoaderSpinner";
import PrivilageBadge from "@/components/users/PrivilageBadge";
import BasicDialog from "@/components/global/BasicDialog";
import UserWithAccess from "./UserWithAccess";
import { Privilage } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  privilage: z.string({
    message: "Please select a valid privilage.",
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
  const recipebookSharedUsersData = recipebookSharedUsers?.data;

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
        privilage: values.privilage,
        recipeBookId: recipeBookId,
      });
      setIsSubmitting(false);
      if (!result.data)
        return notifyError(result.status.toString(), result.errorMessage);

      setIsFormOpen(false);
      notifySuccess(
        "Access granted to:",
        `${values.email} (${values.privilage})`
      );
      form.setValue("email", "");
      form.setValue("privilage", "");
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
          {recipebookSharedUsersData ? (
            <>
              {!!recipebookSharedUsersData.length && (
                <div className="access-manager-list pt-6 w-full">
                  <h3 className="text-16 text-accent">Users with access:</h3>

                  {recipebookSharedUsersData.map((user, index) => (
                    <UserWithAccess
                      key={index}
                      name={user.name}
                      email={user.email}
                      privilage={user.privilage}
                      relationShipId={user.relationshipId}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <LoaderSpinner />
          )}
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
                <FormField
                  control={form.control}
                  name="privilage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="text-16 font-bold text-accent">
                        Privilage
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="input-class border-2 border-accent focus-visible:ring-secondary transition-all">
                          <SelectTrigger>
                            <SelectValue
                              className="placehold:text-secondary"
                              placeholder="Select a privilage"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background">
                          <SelectItem value={Privilage.Editor}>
                            {Privilage.Editor}
                          </SelectItem>
                          <SelectItem value={Privilage.Viewer}>
                            {Privilage.Viewer}
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                  isDisabled={!form.formState.isDirty}
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
