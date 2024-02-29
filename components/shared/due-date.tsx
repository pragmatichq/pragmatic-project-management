import { useState, useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { GenericId } from "convex/values";

export function DueDate({
  task,
  dueDate,
}: {
  task: GenericId<"tasks">;
  dueDate: string;
}) {
  const [date, setDate] = useState<Date | undefined>(
    dueDate ? parseDate(dueDate) : undefined
  );

  const [calendarOpen, setCalendarOpen] = useState(false);

  const updateTaskDueDate = useMutation(api.tasks.updateTaskDueDate);

  useEffect(() => {
    setDate(dueDate ? parseDate(dueDate) : undefined);
  }, [dueDate]);

  function parseDate(dateString: string): Date | undefined {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : undefined;
  }

  useEffect(() => {
    async function handleDueDateChange(date: Date | undefined) {
      await updateTaskDueDate({
        id: task,
        dueDate: date ? date.toISOString() : "",
      });
    }

    handleDueDateChange(date);
  }, [date, task, updateTaskDueDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal", {
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
          defaultMonth={date}
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
