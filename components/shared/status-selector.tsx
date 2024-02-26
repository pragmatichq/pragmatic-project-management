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

export function StatusSelector({
  currentStatus,
  projectID,
  statuses,
}: {
  currentStatus: string;
  projectID: GenericId<"projects">;
  statuses: string[];
}) {
  const [status, setStatus] = useState(currentStatus);
  const updateStatus = useMutation(api.projects.updateProjectStatus);

  useEffect(() => {
    const handleStatusChange = async () => {
      if (status !== currentStatus) {
        await updateStatus({ id: projectID, status: status });
      }
    };

    handleStatusChange();
  }, [status, currentStatus, projectID, updateStatus]);

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
