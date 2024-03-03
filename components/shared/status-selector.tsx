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

interface StatusSelectorPropsBase {
  currentStatus: string;
  statuses: string[];
}

interface WithProject extends StatusSelectorPropsBase {
  projectID: Id<"projects">;
  taskID?: never;
}

interface WithTask extends StatusSelectorPropsBase {
  projectID?: never;
  taskID: Id<"tasks">;
}

type StatusSelectorProps = WithTask | WithProject;

export function StatusSelector({
  currentStatus,
  statuses,
  projectID,
  taskID,
}: StatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus);
  const updateProjectStatus = useMutation(api.projects.update);
  const updateTaskStatus = useMutation(api.tasks.update);

  useEffect(() => {
    const updateStatus = async () => {
      if (status !== currentStatus) {
        if (projectID) {
          await updateProjectStatus({ id: projectID, status });
        } else if (taskID) {
          await updateTaskStatus({ id: taskID, status });
        }
      }
    };
    updateStatus();
  }, [status, projectID, taskID, updateProjectStatus, updateTaskStatus]);

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
