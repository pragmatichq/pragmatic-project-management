import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GenericId } from "convex/values";

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

interface StatusProps {
  currentStatus: string;
  statuses: string[];
}

interface WithProject extends StatusProps {
  projectID: GenericId<"projects">;
  taskID?: never;
}

interface WithTask extends StatusProps {
  projectID?: never;
  taskID: GenericId<"tasks">;
}

type ExclusiveProps = WithTask | WithProject;

export const StatusSelector: React.FC<ExclusiveProps> = ({
  currentStatus,
  statuses,
  projectID,
  taskID,
}) => {
  const [status, setStatus] = useState(currentStatus);
  const updateProjectStatus = useMutation(api.projects.updateProjectStatus);
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

  useEffect(() => {
    const updateStatus = async () => {
      // Only perform the update if the status has actually changed
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
    // This effect is solely responsible for syncing the local state with props
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
};
