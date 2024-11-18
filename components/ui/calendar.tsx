"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

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
  const eventDates = new Set(events);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "dark" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:text-white-1 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded flex justify-center items-center"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-accent text-primary-foreground hover:bg-accent/80 hover:text-primary-foreground focus:text-primary-foreground transition",
        day_today: "!bg-primary text-white-1 hover:!bg-primary/80 transition",
        day_outside:
          "day-outside text-gray-300 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: ({ ...props }) => (
          <div>
            <div className="flex justify-center items-center">
              <div className="relative z-10 text-center">
                {props.date
                  .toLocaleDateString("cs", { day: "numeric" })
                  .replace(".", "")}
              </div>
              {eventDates.has(convertToServerTime(props.date)) && (
                <div className="absolute bg-secondary w-6 h-6 z-0 rounded-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"></div>
              )}
            </div>
          </div>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
