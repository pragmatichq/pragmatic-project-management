import { Dialog, DialogContent } from "@/components/ui/dialog";

import { FileEditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { DueDate } from "@/components/shared/due-date";
import { AssigneeList } from "@/components/shared/assignee-list";
import { StatusSelector } from "@/components/shared/status-selector";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { FlagSelector } from "@/components/shared/flag-selector";
import { CommentList } from "@/components/shared/comment-list";

import type { ActiveTask } from "./task-list";

interface TaskModalProps {
  activeTask: ActiveTask | null;
  open: boolean;
  onStateChange: Function;
}

export function TaskModal({ activeTask, open, onStateChange }: TaskModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => onStateChange()}>
      {activeTask && (
        <DialogContent className="flex gap-8 min-w-[850px]">
          <div className="grow grid gap-4 auto-rows-min">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {activeTask?.projectDetails?.title}
              </p>
              <div className="flex flex-row">
                <h2 className="text-2xl font-bold mr-2">{activeTask?.title}</h2>
                <Button className="w-8 h-8" size="icon" variant="outline">
                  <FileEditIcon className="w-4 h-4" />
                  <span className="sr-only">Edit task</span>
                </Button>
              </div>
            </div>
            <Textarea
              className="min-h-[100px]"
              placeholder="Add your description here."
            />
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="comments">
                <CommentList parent={activeTask._id} />
              </TabsContent>
              <TabsContent value="files">Files</TabsContent>
            </Tabs>
          </div>
          <div className="grid gap-6 auto-rows-min justify-items-start border-l p-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <StatusSelector
                currentStatus={activeTask.status}
                taskID={activeTask._id}
                statuses={["In Progress", "Next Up", "With External", "Done"]}
              />
            </div>
            <div className="grid gap-2">
              <Label>Flags</Label>
              <FlagSelector task={activeTask._id} flags={activeTask.flags} />
            </div>
            <div className="grid gap-2">
              <Label>Assignees</Label>
              <AssigneeList
                task={activeTask._id}
                assignees={activeTask.assignees}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due-date">Due Date</Label>
              <DueDate task={activeTask._id} dueDate={activeTask.dueDate} />
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
