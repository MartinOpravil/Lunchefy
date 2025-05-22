import React from "react";

import { useTranslations } from "next-intl";

import { Mouse } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

const RecipeSkeleton = () => {
  const t = useTranslations("Recipes");
  return (
    <div className="relative h-full w-full">
      <Skeleton className="absolute h-full w-full bg-primary/30" />
      <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 text-white-1">
        <Mouse />
        <div className="text-center">
          {t("Scroll.Top")}
          <h3 className="text-white-1">{t("Scroll.Bottom")}</h3>
        </div>
      </div>
    </div>
  );
};

export default RecipeSkeleton;
