"use client";

import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";

import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

import "../../styles/calendar.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

type CalendarWithEventsProps = CalendarProps & {
  events?: string[];
  isLoading?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  events,
  isLoading,
  ...props
}: CalendarWithEventsProps) {
  const eventDays = Array.from(new Set(events)).map((x) => new Date(x));
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("", className)}
      classNames={{
        root: cn(defaultClassNames.root, "p-3 border-accent"),
        month_caption: cn(
          defaultClassNames.month_caption,
          "calendar-month capitalize",
        ),
        weekdays: cn(defaultClassNames.weekdays, "capitalize"),
        day: cn(
          defaultClassNames.day,
          "transition-all rounded-full hover:opacity-75",
        ),
        day_button: cn(defaultClassNames.day_button, "min-w-full"),
        selected: "select-day",
        today: "bg-secondary/25",
        chevron: "hover:opacity-75",
      }}
      modifiers={{
        events: eventDays,
      }}
      modifiersClassNames={{
        events: "event-day",
      }}
      components={{
        CaptionLabel: (props) => {
          return (
            <span {...props} className={cn(props.className, "flex gap-3")}>
              {props.children}
              {isLoading && (
                <LoaderCircle className="!h-6 !w-6 animate-spin text-primary" />
              )}
            </span>
          );
        },
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
