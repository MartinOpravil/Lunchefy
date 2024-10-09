"use client";
import React, { ReactNode, Ref, useEffect, useRef, useState } from "react";
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
import ActionDialog from "./global/ActionDialog";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();
  const currentPath = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

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

  const handleContinue = () => {
    setIsModalOpen(false);
    if (pendingNavigation) {
      console.log("Should navigate to: ", pendingNavigation);

      form.reset();
      setTimeout(() => {
        router.push(pendingNavigation); // Continue navigation after save
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const originalPush = router.push;

    const interceptNavigation = (newPath: string) => {
      if (form.formState.isDirty) {
        setPendingNavigation(newPath);
        setIsModalOpen(true);
        return false;
      }
      return true;
    };

    router.push = (newPath: string) => {
      if (newPath !== currentPath && !interceptNavigation(newPath)) {
        return; // Prevent navigation if the form is dirty
      }
      return originalPush(newPath); // Proceed with navigation if form is not dirty
    };

    return () => {
      router.push = originalPush; // Restore the original router.push behavior
    };
  }, [form.formState.isDirty, currentPath, router]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
      <ActionDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        confirmAction={handleContinue}
        title="Unsaved changes present"
        description="By proceeding your unsaved changes will be lost. Do you still want to continue?"
        confirmButtonLabel="Continue"
        useConfirmButtonIcon={false}
      />
      <FormStateWatcher onFormStateChange={onFormStateChange} />
    </FormProvider>
  );
};

const FormStateWatcher = ({
  onFormStateChange,
}: {
  onFormStateChange?: (isDirty: boolean) => void;
}) => {
  const { formState } = useFormContext();

  useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange(formState.isDirty); // Notify parent whenever isDirty changes
    }
  }, [formState.isDirty, onFormStateChange]);

  return null;
};

export default FormProviderWrapper;
