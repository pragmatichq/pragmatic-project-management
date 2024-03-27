"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

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
  action: Doc<"actions">;
}

export function StatusSelector({ action }: StatusSelectorProps) {
  const statuses = ["Triage", "In Progress", "Next Up", "Consideration"];
  const updateActionStatus = useMutation(api.actions.update);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge>{action.status}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Project Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={action.status}
          onValueChange={(status) =>
            updateActionStatus({ actionId: action._id, status })
          }
        >
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
