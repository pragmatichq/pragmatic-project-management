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
import { TableNames } from "@/convex/_generated/dataModel";
import { GenericId } from "convex/values";

export function ProjectList({ projects }: { projects: any }) {
  const deleteProject = useMutation(api.projects.deleteProject);

  async function deleteCurrentProject(project_id: GenericId<"projects">) {
    await deleteProject({
      id: project_id,
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead className="w-44">Status</TableHead>
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
                  className="hover:underline"
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
      <TableFooter>
        <TableRow>
          <TableCell>0 of {projects.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
