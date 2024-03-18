"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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

interface StatusSelectorProps {
  currentStatus: string;
  actionId: Id<"actions">;
}

export function StatusSelector({
  currentStatus,
  actionId,
}: StatusSelectorProps) {
  const statuses = ["Triage", "In Progress", "Next Up", "Consideration"];
  const [status, setStatus] = useState(currentStatus);
  const updateActionStatus = useMutation(api.actions.update);

  useEffect(() => {
    const updateStatus = async () => {
      if (status !== currentStatus) {
        await updateActionStatus({ actionId: actionId, status });
      }
    };
    updateStatus();
  }, [status, actionId, updateActionStatus]);

  useEffect(() => {
    if (status !== currentStatus) {
      setStatus(currentStatus);
    }
  }, [currentStatus]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge>{status}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Project Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
          {statuses.map((statusOption) => (
            <DropdownMenuRadioItem key={statusOption} value={statusOption}>
              <Badge>{statusOption}</Badge>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
