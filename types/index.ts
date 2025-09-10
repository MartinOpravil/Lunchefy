import { ReactNode } from "react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { getGroupById } from "@/convex/groups";

import { Privilage, RecipePlannerAction } from "@/enums";

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

export type RecipeRef = {
  id: string;
  name: string;
};

interface PlannerBaseAction {
  plan?: Plan;
}

export interface PlannerAssignAction extends PlannerBaseAction {
  type: RecipePlannerAction.Assign;
  group: Awaited<ReturnType<typeof getGroupById>>;
}

export interface PlannerSwapAction extends PlannerBaseAction {
  id: string;
  type: RecipePlannerAction.Swap;
  group: Awaited<ReturnType<typeof getGroupById>>;
}

export interface PlannerRemoveAction extends PlannerBaseAction {
  type: RecipePlannerAction.Remove;
  id: string;
}

export type PlannerAction =
  | PlannerAssignAction
  | PlannerSwapAction
  | PlannerRemoveAction;

export type TimeLocale = "cs" | "en-GB";
