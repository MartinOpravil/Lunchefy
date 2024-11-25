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

interface GroupFormProps {
  group?: Awaited<ReturnType<typeof getGroupById>>;
}

interface CustomFormContext {
  coverImageRef: React.RefObject<ImageInputHandle>;
}

const GroupForm = ({ group }: GroupFormProps) => {
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
                Name*
              </FormLabel>
              <FormControl>
                <Input
                  className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                  placeholder="Group name"
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
                Description
              </FormLabel>
              <FormControl>
                <AutosizeTextarea
                  className="input-class border-2 border-accent focus-visible:ring-secondary transition"
                  placeholder="Optional group description"
                  {...field}
                  maxHeight={200}
                />
                {/* <Textarea
                  className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                  placeholder="Optional recipe book description"
                  {...field}
                /> */}
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
            image={field.value}
            setImage={(newImage) => {
              field.onChange(newImage);
            }}
            ref={coverImageRef}
            isVerified={group?.data?.isVerified}
          />
        )}
      />
    </div>
  );
};

export default GroupForm;
