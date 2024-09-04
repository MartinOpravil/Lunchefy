import Image from "next/image";
import React, { ReactNode } from "react";

const PageHeader = ({
  title,
  icon,
  actionButton,
}: {
  title: string;
  icon: string;
  actionButton?: ReactNode;
}) => {
  return (
    <nav className="relative">
      <div className="flex items-center justify-between">
        <h2 className="text-primary flex gap-3">
          <Image
            src={`/icons/${icon}.svg`}
            alt="recipe_book"
            width={30}
            height={30}
            className="icon-primary"
          />
          {title}
        </h2>
        {actionButton}
      </div>

      <div className="heading-underline" />
    </nav>
  );
};

export default PageHeader;
