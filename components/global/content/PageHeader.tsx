import { ChefHat } from "lucide-react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  descriptionSlot?: React.ReactNode;
  topLeftSide?: React.ReactNode;
  topRightSide?: React.ReactNode;
  leftSide?: React.ReactNode;
  rightSide?: React.ReactNode;
  showIcon?: boolean;
  titleClassName?: string;
}

const PageHeader = ({
  icon = <ChefHat className="text-white-1" />,
  title,
  description,
  descriptionSlot,
  topLeftSide,
  topRightSide,
  leftSide,
  rightSide,
  showIcon = true,
  titleClassName,
}: PageHeaderProps) => {
  return (
    <nav className="relative">
      <div className="flex flex-wrap items-end justify-between gap-2 gap-y-6">
        <div className="flex w-full flex-grow flex-col sm:w-auto">
          <h2 className={cn("flex items-center gap-3", titleClassName)}>
            {showIcon && (
              <div className="rounded-full bg-primary p-2">{icon}</div>
            )}
            {title}
            {topLeftSide}
          </h2>
          {description && <p className="text-14 italic">{`${description}`}</p>}
          {descriptionSlot}
        </div>
        {topRightSide && (
          <div className="flex flex-grow flex-wrap items-center justify-end gap-2">
            {topRightSide}
          </div>
        )}
      </div>
      <div className="heading-underline" />
      {(leftSide || rightSide) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {leftSide && (
            <div className="flex items-center gap-2">{leftSide}</div>
          )}
          {rightSide && (
            <div className="flex items-center gap-2">{rightSide}</div>
          )}
        </div>
      )}
    </nav>
  );
};

export default PageHeader;
