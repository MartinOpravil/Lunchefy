import { Doc, Id } from "@/convex/_generated/dataModel";
import { Privilage } from "@/enums";
import { ReactNode } from "react";

export interface ImageStateProps {
  imageUrl?: string;
  storageId?: Id<"_storage">;
  externalUrl?: string;
}

export interface ClassListProp {
  classList?: string;
}

export interface AuthButtonProps extends ClassListProp {
  title?: string;
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
  planId: Id<"groupPlans">;
  date: "string";
  recipe: Doc<"recipes">;
  creationTime: number;
}

export interface Author {
  id: string;
  name: string;
  date: number;
  imageSrc: string;
}
