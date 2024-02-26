import { useState, useEffect } from "react";
import { format } from "date-fns";
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
  const [date, setDate] = useState<Date | undefined>(new Date(dueDate));
  const [calendarOpen, setCalendarOpen] = useState(false);

  const updateTaskDueDate = useMutation(api.tasks.updateTaskDueDate);

  useEffect(() => {
    async function handleDueDateChange(date: Date | undefined) {
      await updateTaskDueDate({
        id: task,
        dueDate: date ? date.toISOString() : "",
      });
    }

    if (date) {
      handleDueDateChange(date);
    }
  }, [date, task, updateTaskDueDate]);

  useEffect(() => {
    setDate(new Date(dueDate));
  }, [dueDate]);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
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
