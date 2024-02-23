import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { useEffect } from "react";

import { api } from "@/convex/_generated/api";

import { useMutation } from "convex/react";

import { Badge } from "@/components/ui/badge";

import React from "react";
import { GenericId } from "convex/values";

export function StatusSelector({
  currentStatus,
  projectID,
}: {
  currentStatus: string;
  projectID: GenericId<"projects">;
}) {
  const [status, setStatus] = React.useState(currentStatus);

  const updateStatus = useMutation(api.projects.updateProjectStatus);
  const [prevStatus, setPrevStatus] = React.useState(status);

  async function handleStatusChange(status: string) {
    await updateStatus({
      id: projectID,
      status: status,
    });
    setStatus(status);
  }

  if (status !== prevStatus) {
    setPrevStatus(status);
    handleStatusChange(status);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge>{status}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Project Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
          <DropdownMenuRadioItem value="In Progress">
            <Badge>In Progress</Badge>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Next Up">
            <Badge>Next Up</Badge>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Consideration">
            <Badge>Consideration</Badge>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
