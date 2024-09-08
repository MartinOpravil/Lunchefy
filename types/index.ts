import { GenericId } from "convex/values";

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

export interface RecipeBookProps {
  id: GenericId<"recipeBooks">;
  title: string;
}

export interface AlertDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  subject?: string;
  action: () => void;
}
