import React from "react";

import { useTimeLocale } from "@/hooks/useTimeLocale";
import { getDay } from "@/lib/time";

interface PlannerDateBadgeProps {
  dateNumber: number;
}

const PlannerDateBadge = ({ dateNumber }: PlannerDateBadgeProps) => {
  const locale = useTimeLocale();

  return (
    <div className="bg-background/75 text-14 border-1 flex h-fit w-fit select-none items-center gap-2 rounded-full border border-accent px-3 py-1 text-text">
      {getDay(dateNumber, locale).toUpperCase()}
    </div>
  );
};

export default PlannerDateBadge;
