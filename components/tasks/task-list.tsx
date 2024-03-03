import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { AssigneeList } from "@/components/shared/assignee-list";
import { DueDate } from "@/components/shared/due-date";
import { StatusSelector } from "@/components/shared/status-selector";
import { TaskModal } from "@/components/tasks/task-modal";
import { FlagSelector } from "@/components/shared/flag-selector";

import { Doc } from "@/convex/_generated/dataModel";

import { Id } from "@/convex/_generated/dataModel";

interface ActiveTask {
  _id: Id<"tasks">;
  title: string;
  projectDetails: {
    title: string;
  };
  status: string;
  flags: string[];
  assignees: string[];
  dueDate: string;
}

interface TaskListProps {
  tasks: Array<Doc<"tasks">>;
}

export function TaskList({ tasks }: TaskListProps) {
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = (newState: boolean) => {
    setModalOpen(newState);
  };

  const switchActiveTask = (task: any) => {
    setActiveTask(task);
    setModalOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>Assignees</TableHead>
            <TableHead>Due Date</TableHead>
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
                  <Button
                    className="p-0"
                    variant="link"
                    onClick={() => switchActiveTask(task)}
                  >
                    {task.title}
                  </Button>
                </TableCell>
                <TableCell>
                  <StatusSelector
                    currentStatus={task.status}
                    taskID={task._id}
                    statuses={[
                      "In Progress",
                      "Next Up",
                      "With External",
                      "Done",
                    ]}
                  />
                </TableCell>
                <TableCell>
                  <FlagSelector task={task._id} flags={task.flags} />
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
      <TaskModal
        activeTask={activeTask}
        onStateChange={handleModalOpen}
        open={modalOpen}
      />
    </>
  );
}
