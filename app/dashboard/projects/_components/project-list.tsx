import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";

import Link from "next/link";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import React from "react";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StatusSelector } from "./status-selector";
import { GenericId } from "convex/values";

import { Badge } from "@/components/ui/badge";

import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { ChevronDownIcon } from "lucide-react";

export function ProjectList({
  projects,
  headerName,
}: {
  projects: any;
  headerName: string;
}) {
  let emptyProject: boolean;
  projects.length != 0 ? (emptyProject = false) : (emptyProject = true);
  const [isOpen, setIsOpen] = useState(!emptyProject ? true : false);
  const deleteProject = useMutation(api.projects.deleteProject);

  useEffect(() => {
    !emptyProject ? setIsOpen(true) : setIsOpen(false);
  }, [emptyProject]);

  async function deleteCurrentProject(project_id: GenericId<"projects">) {
    await deleteProject({
      id: project_id,
    });
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group mb-4">
      <CollapsibleTrigger>
        <Badge className="font-bold text-md">
          {headerName}
          <ChevronDownIcon className="group-data-[state=closed]:-rotate-90 group-data-[state=open]:rotate-0 ml-1" />
        </Badge>
        <span className="text-xs font-light ml-2 text-left">
          {projects.length} projects
        </span>
      </CollapsibleTrigger>
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
            {projects.length <= 0 ? (
              <div className="p-4">No Projects</div>
            ) : (
              projects?.map((project: any) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">
                    <Link
                      href={"/dashboard/projects/" + project._id}
                      className="hover:underline font-semibold"
                    >
                      {project.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusSelector
                      currentStatus={project.status}
                      projectID={project._id}
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
