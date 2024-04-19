"use client";

import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { statuses, time_frames } from "@/lib/hooks/getOrganizationCustom"; // Assuming this now also provides timeFrames
import { Doc } from "@/convex/_generated/dataModel";

interface StatusSelectorProps {
  action: Doc<"actions">;
  mode: "status" | "time_frame"; // New prop to decide the mode
}

export function StatusSelector({ action, mode }: StatusSelectorProps) {
  const updateAction = useMutation(api.actions.update);

  // Depending on the mode, use either statuses or timeFrames
  const options = mode === "status" ? statuses : time_frames;
  const currentValue = action[mode];

  const handleUpdate = (newValue: string) => {
    updateAction({ actionId: action._id, [mode]: newValue });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-start items-center text-left font-normal text-[14px] w-full h-10 hover:bg-gray-100">
        {currentValue ? <Badge>{currentValue}</Badge> : "-"}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {mode === "status" ? "Project Status" : "Time Frame"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentValue}
          onValueChange={handleUpdate}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <Badge>{option.value}</Badge>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
