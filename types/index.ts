import { Doc, Id } from "@/convex/_generated/dataModel";
import { Privilage } from "@/enums";
import { GenericId } from "convex/values";
import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

export interface ImageStateProps {
  imageUrl: string;
  storageId?: Id<"_storage">;
}

export interface ClassListProp {
  classList?: string;
}

export interface AuthButtonProps extends ClassListProp {
  title?: string;
}

export interface ImageInputProps {
  image?: ImageStateProps;
  setImage: Dispatch<SetStateAction<ImageStateProps | undefined>>;
  label?: string;
  title?: string;
  description?: string;
}

export interface ImageInputHandle {
  commit: () => Promise<ImageStateProps | undefined>;
  getImageBlob: () => Blob | undefined;
}

export interface BasicDialogProps extends ClassListProp {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description?: string;
  icon?: ReactNode;
  content: ReactNode;
  action?: ReactNode;
}

export interface PrivilageBadgeProps {
  privilage: Privilage;
}

export interface FormMethods {
  save: () => void;
}

export interface FormImage {
  upload: () => void;
}

export interface FormState {
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface Plan {
  planId: Id<"plannedGroupRecipes">;
  date: "string";
  recipe: Doc<"recipes">;
}
