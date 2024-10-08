import { Id } from "@/convex/_generated/dataModel";
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
}

export interface RecipeBookProps {
  id: GenericId<"recipeBooks">;
  title: string;
  description?: string;
  imageUrl?: string;
  privilage: string;
}

export interface RecipeProps {
  id: GenericId<"recipes">;
  recipeBookId: GenericId<"recipeBooks">;
  title: string;
  privilage: Privilage;
  description?: string;
  imageUrl?: string;
  tags?: Array<string>;
  ingredients?: string;
  recipe?: string;
  recipePhotoUrl?: string;
}

export interface BasicDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description?: string;
  icon?: ReactNode;
  content: ReactNode;
  action?: ReactNode;
}

export interface AlertDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  subject?: string;
  action: () => void;
  confirmButtonLabel?: string;
}

export interface AccessManagerProps {
  recipeBookName: string;
  recipeBookId: GenericId<"recipeBooks">;
}

export interface PrivilageBadgeProps {
  privilage: Privilage;
}

export interface UserWithAccessProps {
  name: string;
  email: string;
  privilage: Privilage;
  relationShipId: GenericId<"userRecipeBookRelationship">;
}

export interface UserAccessFormProps {
  name: string;
  email: string;
  privilage: Privilage;
  relationShipId: GenericId<"userRecipeBookRelationship">;
  actionClicked: () => void;
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
