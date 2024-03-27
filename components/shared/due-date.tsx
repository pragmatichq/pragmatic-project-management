import { useState } from "react";
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

interface DueDateProps {
  action: any;
}

export function DueDate({ action }: DueDateProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const updateActionDueDate = useMutation(api.actions.update);
  const parsedDate = parseDate(action.due_date);

  function parseDate(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined;
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : undefined;
  }

  const setDate = async (newDate: Date | undefined) => {
    const newDueDate = newDate ? newDate.toISOString() : "";
    if (newDueDate !== action.due_date) {
      await updateActionDueDate({ actionId: action._id, due_date: newDueDate });
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal w-full", {
            "text-muted-foreground": !parsedDate,
            "border-yellow-200 text-yellow-500 border-2":
              parsedDate && parsedDate.getTime() === today.getTime(),
            "border-red-200 text-red-500 border-2 border-dashed":
              parsedDate && parsedDate.getTime() < today.getTime(),
          })}
        >
          <CalendarIcon
            className={cn("mr-2 h-4 w-4", {
              "text-muted-foreground": !parsedDate,
              "text-yellow-500":
                parsedDate && parsedDate.getTime() === today.getTime(),
              "text-red-500":
                parsedDate && parsedDate.getTime() < today.getTime(),
            })}
          />
          {parsedDate ? (
            format(parsedDate, "MM/dd/yyyy")
          ) : (
            <span>No Due Date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={parsedDate}
          defaultMonth={parsedDate || undefined} // Ensure 'defaultMonth' is undefined if 'date' is not set
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
