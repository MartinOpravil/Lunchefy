import { useState } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { GenericId } from "convex/values";
import { Save, Trash2 } from "lucide-react";
import { z } from "zod";

import ActionButton from "@/components/global/button/ActionButton";
import ActionDialog from "@/components/global/dialog/ActionDialog";
import {
  Form,
  FormControl,
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

import { ButtonVariant, HttpResponseCode, Privilage } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";

const formSchema = z.object({
  privilage: z.string(),
});

export interface UserAccessFormProps {
  name: string;
  email: string;
  privilage: Privilage;
  relationshipId: GenericId<"userGroupRelationship">;
  actionClicked: () => void;
}

const UserAccessForm = ({
  name,
  email,
  privilage,
  relationshipId,
  actionClicked,
}: UserAccessFormProps) => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const changeAccess = useMutation(api.groups.changeAccessToGroup);
  const revokeAccess = useMutation(api.groups.revokeAccessToGroup);

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
        relationshipId,
        privilage: form.getValues("privilage"),
      });
      setIsSubmitting(false);
      if (!result.data) {
        switch (result.status) {
          case HttpResponseCode.Forbidden:
            return notifyError(
              t("Groups.AccessManager.Notification.Error.Update403"),
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      notifySuccess(
        t("Groups.AccessManager.Notification.Success.Update", {
          privilage: values.privilage,
        }),
      );
      actionClicked();
      form.setValue("privilage", "");
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  const handleRevokeAccess = async () => {
    setIsDeleting(true);
    try {
      const result = await revokeAccess({ relationshipId });
      setIsDeleting(false);
      if (!result.data) {
        switch (result.status) {
          case HttpResponseCode.Forbidden:
            return notifyError(
              t("Groups.AccessManager.Notification.Error.Revoke403"),
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }
      notifySuccess(
        t("Groups.AccessManager.Notification.Success.Revoke", { name, email }),
      );
      actionClicked();
    } catch (error) {
      console.error("Error revoking access", error);
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
                  <FormLabel className="input-label">
                    {t("Groups.AccessManager.Form.Property.Privilage")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="input-class">
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Privilage.Editor}>
                        {t(
                          `Groups.AccessManager.Privilage.${Privilage.Editor}`,
                        )}
                      </SelectItem>
                      <SelectItem value={Privilage.Viewer}>
                        {t(
                          `Groups.AccessManager.Privilage.${Privilage.Viewer}`,
                        )}
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
              icon={
                <Trash2 className="text-text transition-all group-hover:text-primary" />
              }
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault();
                setIsDeleteDialogOpen(true);
              }}
              variant={ButtonVariant.NegativeMinimalistic}
            />
            <ActionButton
              title={t("Global.Button.Update")}
              icon={<Save />}
              variant={ButtonVariant.Positive}
              isLoading={isSubmitting}
              classList="min-w-32"
              isDisabled={!form.formState.isDirty}
              onClick={form.handleSubmit(onSubmit)}
            />
          </div>
        </form>
      </Form>
      <ActionDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        title={t("Groups.AccessManager.RevokeAccessTitle")}
        subject={`${name}\n(${email})`}
        description={t("Groups.AccessManager.RevokeAccessDisclaimer")}
        confirmButtonLabel={t("Groups.AccessManager.Button.Revoke")}
        confirmAction={handleRevokeAccess}
      />
    </>
  );
};

export default UserAccessForm;
