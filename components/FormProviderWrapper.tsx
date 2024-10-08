import React, { ReactNode, Ref, useEffect, useRef } from "react";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
  DefaultValues,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodSchema } from "zod";
import { ImageInputHandle } from "@/types";

interface FormContextProps<T extends FieldValues> extends UseFormReturn<T> {
  coverImageRef: Ref<ImageInputHandle>;
  recipeImageRef?: Ref<ImageInputHandle>;
}

interface FormProviderWrapperProps<T extends FieldValues> {
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  formSchema: ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onFormStateChange?: (isDirty: boolean) => void; // Callback to notify parent of dirty state
  passResetToParent?: (reset: () => void) => void; // Callback to pass the reset method to the parent
  coverImageRef: Ref<ImageInputHandle>;
  recipeImageRef?: Ref<ImageInputHandle>;
}

const FormProviderWrapper = <T extends FieldValues>({
  children,
  onSubmit,
  formSchema,
  defaultValues,
  onFormStateChange,
  passResetToParent,
  coverImageRef,
  recipeImageRef,
}: FormProviderWrapperProps<T>) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values: defaultValues as T,
  });

  const methods: FormContextProps<T> = {
    ...form,
    coverImageRef,
    recipeImageRef,
  };

  useEffect(() => {
    if (passResetToParent) {
      passResetToParent(() => form.reset);
    }
  }, [form.reset, passResetToParent]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
      <FormStateWatcher onFormStateChange={onFormStateChange} />
    </FormProvider>
  );
};

const FormStateWatcher = ({
  onFormStateChange,
}: {
  onFormStateChange?: (isDirty: boolean) => void;
}) => {
  const { formState } = useFormContext(); // Access form state from react-hook-form

  useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange(formState.isDirty); // Notify parent whenever isDirty changes
    }
  }, [formState.isDirty, onFormStateChange]);

  return null;
};

export default FormProviderWrapper;
