"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "convex-helpers/react/cache";
import { useMutation } from "convex/react";
import { GenericId } from "convex/values";
import { Share2 } from "lucide-react";
import { z } from "zod";

import ActionButton from "@/components/global/button/ActionButton";
import LoaderSpinner from "@/components/global/content/LoaderSpinner";
import UserWithAccess from "@/components/group/accessManager/UserWithAccess";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ButtonVariant, HttpResponseCode, Privilage } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";

export interface AccessManagerProps {
  groupName: string;
  groupId: GenericId<"groups">;
}

const AccessManager = ({ groupName, groupId }: AccessManagerProps) => {
  const t = useTranslations();

  const [formSchema, setFormSchema] = useState(
    z.object({
      email: z.string().email({
        message: t("Groups.AccessManager.Form.Validation.Email"),
      }),
      privilage: z.string({
        message: t("Groups.AccessManager.Form.Validation.Privilage"),
      }),
    }),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const addAccessToGroup = useMutation(api.groups.addAccessToGroup);
  const groupSharedUsers = useQuery(api.groups.getGroupSharedUsers, {
    groupId,
  });
  const groupSharedUsersData = groupSharedUsers?.data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const result = await addAccessToGroup({
        email: values.email,
        privilage: values.privilage,
        groupId,
      });
      setIsSubmitting(false);
      if (!result.data)
        return notifyError(result.status.toString(), result.errorMessage);
      if (!result.data) {
        switch (result.status) {
          case HttpResponseCode.NotFound:
            return notifyError(
              t("Groups.AccessManager.Notification.Error.Create404"),
            );
          case HttpResponseCode.Conflict:
            return notifyError(
              t("Groups.AccessManager.Notification.Error.Create409"),
            );
          case HttpResponseCode.InternalServerError:
            return notifyError(
              t("Groups.AccessManager.Notification.Error.Create500"),
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      setIsFormOpen(false);
      notifySuccess(
        t("Groups.AccessManager.Notification.Success.Create", {
          email: values.email,
          privilage: values.privilage,
        }),
      );
      form.setValue("email", "");
      form.setValue("privilage", "");
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="access-manager w-full transition-all @container">
      {!isFormOpen && (
        <>
          <div className="flex flex-col">
            <ActionButton
              title={t("Groups.AccessManager.Button.Share")}
              icon={<Share2 />}
              isLoading={isSubmitting}
              classList="min-w-32"
              onClick={() => setIsFormOpen(true)}
              variant={ButtonVariant.Positive}
            />
          </div>
          {groupSharedUsersData ? (
            <>
              {!!groupSharedUsersData.length && (
                <div className="access-manager-list w-full pt-6">
                  <h3 className="text-16 text-text">
                    {t("Groups.AccessManager.ListTitle")}
                  </h3>

                  {groupSharedUsersData.map((user, index) => (
                    <UserWithAccess
                      key={index}
                      name={user.name}
                      email={user.email}
                      privilage={user.privilage}
                      relationshipId={user.relationshipId}
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
                      <FormLabel className="input-label">
                        {t("Groups.AccessManager.Form.Property.Email")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="input-class"
                          placeholder={t(
                            "Groups.AccessManager.Form.Placeholder.Email",
                          )}
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
                      <FormLabel className="input-label">
                        {t("Groups.AccessManager.Form.Property.Privilage")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="input-class">
                          <SelectTrigger>
                            <SelectValue
                              className=""
                              placeholder={t(
                                "Groups.AccessManager.Form.Placeholder.Privilage",
                              )}
                            />
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
                  title={t("Global.Button.Cancel")}
                  onClick={() => setIsFormOpen(false)}
                />
                <ActionButton
                  title={t("Groups.AccessManager.Button.Share")}
                  icon={<Share2 />}
                  isLoading={isSubmitting}
                  classList="min-w-32"
                  isDisabled={!form.formState.isDirty}
                  onClick={form.handleSubmit(onSubmit)}
                  variant={ButtonVariant.Positive}
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
