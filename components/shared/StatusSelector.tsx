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
import { statuses } from "@/lib/hooks/getOrganizationCustom";

interface StatusSelectorProps {
  action: Doc<"actions">;
}

export function StatusSelector({ action }: StatusSelectorProps) {
  const updateActionStatus = useMutation(api.actions.update);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-start items-center text-left font-normal text-[14px] w-full h-10 hover:bg-gray-100">
        <Badge>{action.status}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Project Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={action.status}
          onValueChange={(statusValue) =>
            updateActionStatus({ actionId: action._id, status: statusValue })
          }
        >
          {statuses.map((statusOption) => (
            <DropdownMenuRadioItem
              key={statusOption.value}
              value={statusOption.value}
            >
              <Badge>{statusOption.value}</Badge>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
