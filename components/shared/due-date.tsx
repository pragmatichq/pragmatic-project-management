"use client";

import { useState, useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Id } from "@/convex/_generated/dataModel";

interface DueDateProps {
  actionId: Id<"actions">;
  dueDate: string | undefined;
}

export function DueDate({ actionId, dueDate }: DueDateProps) {
  const [date, setDate] = useState<Date | undefined>(
    dueDate && dueDate !== "" ? parseDate(dueDate) : undefined
  );

  const [calendarOpen, setCalendarOpen] = useState(false);

  const updateActionDueDate = useMutation(api.actions.update);

  useEffect(() => {
    // Handle the empty string as a valid due date value
    setDate(dueDate && dueDate !== "" ? parseDate(dueDate) : undefined);
  }, [dueDate]);

  useEffect(() => {
    async function handleDueDateChange() {
      const newDueDate = date ? date.toISOString() : "";
      if (newDueDate !== dueDate) {
        await updateActionDueDate({
          actionId: actionId,
          due_date: newDueDate,
        });
      }
    }

    // Adjust the condition to account for the possibility of an empty string as a due date
    if (date || (!date && dueDate !== "")) {
      handleDueDateChange();
    }
  }, [date, dueDate, actionId, updateActionDueDate]);

  function parseDate(dateString: string): Date | undefined {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : undefined;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal w-full", {
            "text-muted-foreground": !date,
            "border-yellow-200 text-yellow-500 border-2":
              date && date.getTime() === today.getTime(),
            "border-red-200 text-red-500 border-2 border-dashed":
              date && date.getTime() < today.getTime(),
          })}
        >
          <CalendarIcon
            className={cn("mr-2 h-4 w-4", {
              "text-muted-foreground": !date,
              "text-yellow-500": date && date.getTime() === today.getTime(),
              "text-red-500": date && date.getTime() < today.getTime(),
            })}
          />
          {date ? format(date, "MM/dd/yyyy") : <span>No Due Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date ? date : undefined} // Ensure 'defaultMonth' is undefined if 'date' is not set
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            setCalendarOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
