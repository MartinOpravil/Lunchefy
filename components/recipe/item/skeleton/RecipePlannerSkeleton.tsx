import React from "react";

import { useTranslations } from "next-intl";

import { Mouse } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

const RecipePlannerSkeleton = () => {
  const t = useTranslations("Recipes");
  return (
    <div className="relative h-full w-full">
      <Skeleton className="absolute h-full w-full bg-primary/30" />
      <div className="flex h-full w-full items-center justify-center gap-2 p-4">
        <Mouse />
        <div className="flex items-center justify-center gap-1 text-center">
          {t("Scroll.Top")}
          <h3 className="text-white-1">{t("Scroll.Bottom")}</h3>
        </div>
      </div>
    </div>
  );
};

export default RecipePlannerSkeleton;
