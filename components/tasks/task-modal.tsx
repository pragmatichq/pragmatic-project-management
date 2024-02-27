import { Dialog, DialogContent } from "@/components/ui/dialog";

import { FileEditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { DueDate } from "../shared/due-date";
import { AssigneeList } from "../shared/assignee-list";
import { StatusSelector } from "../shared/status-selector";

export function TaskModal({
  activeTask,
  open,
  onStateChange,
}: {
  activeTask: any;
  open: boolean;
  onStateChange: Function;
}) {
  return (
    <Dialog open={open} onOpenChange={() => onStateChange()}>
      <DialogContent className="max-w-6xl h-[90%] flex gap-8">
        <div className="grow">
          <div className="flex flex-row">
            <h2 className="text-2xl font-bold">{activeTask?.title}</h2>
            <Button
              className="w-8 h-8 rounded-full border"
              size="icon"
              variant="outline"
            >
              <FileEditIcon className="w-4 h-4" />
              <span className="sr-only">Edit task</span>
            </Button>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {activeTask?.projectDetails?.title}
          </p>
          <Textarea
            className="min-h-[100px]"
            placeholder="Add your description here."
          />
        </div>
        <div className="grid gap-4 auto-rows-min ">
          <div className="grid gap-2">
            <Label htmlFor="due-date">Due Date</Label>
            <DueDate task={activeTask._id} dueDate={activeTask.dueDate} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <StatusSelector
              currentStatus={activeTask.status}
              taskID={activeTask._id}
              statuses={["In Progress", "Next Up", "With External", "Done"]}
            />
          </div>
          <div className="grid gap-2">
            <Label>Assignees</Label>
            <AssigneeList
              task={activeTask._id}
              assignees={activeTask.assignees}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
