import Link from "next/link";

import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { AssigneeList } from "@/components/shared/assignee-list";
import { DueDate } from "@/components/shared/due-date";
import { StatusSelector } from "../shared/status-selector";

export function TaskList({ tasks }: { tasks: any }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/2">Title</TableHead>
          <TableHead className="w-{1/8}">Flags</TableHead>
          <TableHead className="w-{1/8}">Status</TableHead>
          <TableHead className="w-{1/8}">Assignees</TableHead>
          <TableHead className="w-{1/8}">Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks?.length <= 0 ? (
          <div className="p-4">No Tasks</div>
        ) : (
          tasks?.map((task: any) => (
            <TableRow key={task._id}>
              <TableCell className="font-medium">
                {task.projectDetails != undefined ? (
                  <small className="text-xs text-muted-foreground">
                    {task.projectDetails.title}
                    <br />
                  </small>
                ) : (
                  ""
                )}
                <Link
                  href={`/dashboard/projects/${task.project}/task/${task._id}`}
                >
                  {task.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="destructive">Need Information</Badge>
              </TableCell>
              <TableCell>
                <StatusSelector
                  currentStatus={task.status}
                  taskID={task._id}
                  statuses={["In Progress", "Next Up", "With External", "Done"]}
                />
              </TableCell>
              <TableCell>
                <AssigneeList task={task._id} assignees={task.assignees} />
              </TableCell>
              <TableCell>
                <DueDate task={task._id} dueDate={task.dueDate} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
