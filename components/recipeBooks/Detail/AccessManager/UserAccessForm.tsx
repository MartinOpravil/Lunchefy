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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Privilage } from "@/enums";
import { UserAccessFormProps } from "@/types";
import ActionButton from "@/components/global/ActionButton";
import ActionDialog from "@/components/global/ActionDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
  privilage: z.string({
    message: "Please select a valid privilage.",
  }),
});

const UserAccessForm = ({
  name,
  email,
  privilage,
  relationShipId,
  actionClicked,
}: UserAccessFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const changeAccess = useMutation(api.recipeBooks.changeAccessToRecipeBook);
  const revokeAccess = useMutation(api.recipeBooks.revokeAccessToRecipeBook);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privilage: privilage ?? Privilage.Viewer,
    },
    values: {
      privilage: privilage ?? Privilage.Viewer,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const result = await changeAccess({
        relationShipId: relationShipId,
        privilage: form.getValues("privilage"),
      });
      setIsSubmitting(false);
      actionClicked();
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  const handleDeleteRecipeBook = async () => {
    setIsDeleting(true);
    try {
      const result = await revokeAccess({ relationShipId });
      setIsDeleting(false);
      actionClicked();
    } catch (error) {
      console.error("Error deleting recipe book", error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] pb-6">
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
                        <SelectValue placeholder="Select a verified email to display" />
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
          <div className="flex justify-between gap-2">
            <ActionButton
              icon="delete"
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault();
                setIsDeleteDialogOpen(true);
              }}
              classList="!bg-primary hover:!bg-accent"
            />
            <ActionButton
              title="Update"
              icon="save"
              isLoading={isSubmitting}
              classList="min-w-32"
              onClick={form.handleSubmit(onSubmit)}
            />
          </div>
        </form>
      </Form>
      <ActionDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        title="Are you sure you want to revoke access?"
        subject={name}
        description="User will lose access for this recipe book."
        confirmButtonLabel="Revoke"
        action={handleDeleteRecipeBook}
      />
    </>
  );
};

export default UserAccessForm;