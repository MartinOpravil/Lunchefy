"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useFormContext } from "react-hook-form";
import ImageInput from "@/components/global/ImageInput";
import { ImageInputHandle } from "@/types";
import PrivilageBadge from "@/components/users/PrivilageBadge";
import { getGroupById } from "@/convex/groups";
import { Textarea } from "@/components/ui/textarea";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { useTranslations } from "next-intl";

interface GroupFormProps {
  group?: Awaited<ReturnType<typeof getGroupById>>;
  isVerified: boolean;
}

interface CustomFormContext {
  coverImageRef: React.RefObject<ImageInputHandle>;
}

const GroupForm = ({ group, isVerified = false }: GroupFormProps) => {
  const t = useTranslations("Groups");
  const { register, coverImageRef } = useFormContext() as ReturnType<
    typeof useFormContext
  > &
    CustomFormContext;

  return (
    <div className="w-full">
      <div className="flex justify-end">
        {group && group.data && (
          <PrivilageBadge privilage={group.data.privilage} />
        )}
      </div>
      <div className="flex flex-col gap-[30px] pb-6">
        <FormField
          {...{ ...register("name"), ref: null }}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-16 font-bold text-accent">
                {t("General.Form.Property.Name")}*
              </FormLabel>
              <FormControl>
                <Input
                  className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                  placeholder={t("General.Form.Placeholder.Name")}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-primary" />
            </FormItem>
          )}
        />
        <FormField
          {...{ ...register("description"), ref: null }}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-16 font-bold text-accent">
                {t("General.Form.Property.Description")}
              </FormLabel>
              <FormControl>
                <AutosizeTextarea
                  className="input-class border-2 border-accent focus-visible:ring-secondary transition"
                  placeholder={t("General.Form.Placeholder.Description")}
                  {...field}
                  maxHeight={200}
                />
              </FormControl>
              <FormMessage className="text-primary" />
            </FormItem>
          )}
        />
      </div>
      <FormField
        {...{ ...register("coverImage"), ref: null }}
        render={({ field }) => (
          <ImageInput
            label={t("General.Form.Property.CoverImage")}
            image={field.value}
            setImage={(newImage) => {
              field.onChange(newImage);
            }}
            ref={coverImageRef}
            isVerified={isVerified}
          />
        )}
      />
    </div>
  );
};

export default GroupForm;
