import { Id } from "@/convex/_generated/dataModel";
import { GenericId } from "convex/values";
import { Dispatch, SetStateAction } from "react";

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

export interface ActionButtonProps {
  title?: string;
  icon?: string;
  classList?: string;
  isLoading?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface LinkButtonProps {
  title?: string;
  icon?: string;
  href: string;
  classList?: string;
}

export interface IconImageProps {
  name: string;
  width?: number;
  height?: number;
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
  imageUrl?: string;
  privilage: string;
}

export interface AlertDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  subject?: string;
  action: () => void;
}

export interface AccessManagerProps {
  recipeBookName: string;
  recipeBookId: GenericId<"recipeBooks">;
}
