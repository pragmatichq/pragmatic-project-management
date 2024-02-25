"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import { GenericId } from "convex/values";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DueDate({
  task,
  dueDate,
}: {
  task: GenericId<"tasks">;
  dueDate: any;
}) {
  const [date, setDate] = useState<Date | undefined>(dueDate);
  const [prevDate, setPrevDate] = useState(date);

  const [calendarOpen, setCalendarOpen] = useState(false);

  const updateDueDate = useMutation(api.tasks.updateDueDate);

  async function handleDueDateChange(
    date: Date | undefined,
    id: GenericId<"tasks">
  ) {
    await updateDueDate({
      id: id,
      dueDate: date ? date.toISOString() : "",
    });
    setDate(date);
  }

  if (date !== prevDate) {
    setPrevDate(date);
    handleDueDateChange(date, task);
  }

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MM/dd/yyyy") : <span>No Due Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date && new Date(date)}
          defaultMonth={date}
          onSelect={(currentValue) => {
            setDate(currentValue);
            setCalendarOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
