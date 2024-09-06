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
  onClick: () => void;
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
