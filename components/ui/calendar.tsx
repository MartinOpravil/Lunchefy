"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { convertToServerTime } from "@/lib/time";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

type CalendarWithEventsProps = CalendarProps & {
  events?: string[];
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  events,
  ...props
}: CalendarWithEventsProps) {
  const eventDays = Array.from(new Set(events)).map((x) => new Date(x));
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("", className)}
      classNames={{
        root: cn(defaultClassNames.root, "p-3"),
        month_caption: cn(
          defaultClassNames.month_caption,
          "calendar-month capitalize"
        ),
        weekdays: cn(defaultClassNames.weekdays, "capitalize"),
        day: cn(defaultClassNames.day, "rounded-full"),
        selected: "select-day",
        today: "bg-secondary/25",
        chevron: "",
      }}
      modifiers={{
        events: eventDays,
      }}
      modifiersClassNames={{
        events: "event-day",
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeft {...props} />;
          }
          return <ChevronRight {...props} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
