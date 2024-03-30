import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  CalendarSearch,
} from "lucide-react";
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
          variant="ghost"
          className={cn("justify-start text-left font-normal w-full p-0", {
            "text-muted-foreground": !parsedDate,
            " text-yellow-500 hover:text-yellow-400":
              parsedDate && parsedDate.getTime() === today.getTime(),
            " text-red-500 hover:text-red-400":
              parsedDate && parsedDate.getTime() < today.getTime(),
          })}
        >
          {parsedDate ? (
            <CalendarIcon
              className={cn("mr-2 h-4 w-4", {
                "text-muted-foreground": !parsedDate,
                "text-yellow-500":
                  parsedDate && parsedDate.getTime() === today.getTime(),
                "text-red-500":
                  parsedDate && parsedDate.getTime() < today.getTime(),
              })}
            />
          ) : (
            <CalendarPlus className="mr-2 h-4 w-4" />
          )}
          {parsedDate ? format(parsedDate, "MM/dd") : ""}
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
