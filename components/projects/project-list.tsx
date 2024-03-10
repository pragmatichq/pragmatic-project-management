import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trash, ChevronDownIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GenericId } from "convex/values";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { StatusSelector } from "../shared/status-selector";

import { Doc } from "@/convex/_generated/dataModel";

interface ProjectListProps {
  projects: Array<Doc<"projects">>;
  headerName: string;
}

export function ProjectList({ projects, headerName }: ProjectListProps) {
  const isEmptyProject = projects.length === 0;
  const [isOpen, setIsOpen] = useState(!isEmptyProject);

  const deleteProject = useMutation(api.projects.remove);

  useEffect(() => {
    setIsOpen(!isEmptyProject);
  }, [isEmptyProject]);

  async function deleteCurrentProject(project_id: GenericId<"projects">) {
    await deleteProject({ id: project_id });
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group mb-4">
      <CollapsibleTrigger asChild>
        <Button variant="link" className="font-bold text-md">
          {headerName}
          <ChevronDownIcon className="group-data-[state=closed]:-rotate-90 group-data-[state=open]:rotate-0 ml-1" />
        </Button>
      </CollapsibleTrigger>
      <span className="text-xs font-light ml-2 text-left">
        {projects.length} projects
      </span>
      <CollapsibleContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-[160px]">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmptyProject ? (
              <TableRow>
                <TableCell className="font-medium">No Projects</TableCell>
              </TableRow>
            ) : (
              projects.map((project: any) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/projects/${project._id}`}
                      className="hover:underline font-semibold"
                    >
                      {project.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusSelector
                      currentStatus={project.status}
                      projectID={project._id}
                      statuses={["In Progress", "On Hold", "Done"]}
                    />
                  </TableCell>
                  <TableCell className="w-16">
                    <Button
                      variant="destructive"
                      onClick={() => deleteCurrentProject(project._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
}
