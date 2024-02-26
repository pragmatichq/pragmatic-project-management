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

// Extended interface with a different additional property
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
    if (projectID) {
      const handleStatusChange = async () => {
        if (status !== currentStatus) {
          await updateProjectStatus({ id: projectID, status: status });
        }
      };
      handleStatusChange();
    } else if (taskID) {
      const handleStatusChange = async () => {
        if (status !== currentStatus) {
          await updateTaskStatus({ id: taskID, status: status });
        }
      };
      handleStatusChange();
    }
  }, [status, currentStatus, projectID, updateProjectStatus, updateTaskStatus]);

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
