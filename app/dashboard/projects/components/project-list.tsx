import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import Link from "next/link";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ProjectList({ projects }: { projects: any }) {
  const deleteProject = useMutation(api.projects.deleteProject);

  async function deleteCurrentProject(project_id: string) {
    await deleteProject({
      id: project_id,
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead className="w-32">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.length <= 0 ? (
          <div className="p-4">No Projects</div>
        ) : (
          projects?.map((project: any) => (
            <TableRow>
              <TableCell className="font-medium">
                <Link
                  href={"/dashboard/projects/" + project._id}
                  className="hover:underline"
                >
                  {project.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge>In Progress</Badge>
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
        <TableFooter>
          <TableCell>0 of {projects.length}</TableCell>
        </TableFooter>
      </TableBody>
    </Table>
  );
}
