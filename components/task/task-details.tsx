"use client";

import { DueDate } from "@/components/shared/due-date";
import { AssigneeList } from "@/components/shared/assignee-list";
import { StatusSelector } from "@/components/shared/status-selector";
import { FlagSelector } from "@/components/shared/flag-selector";
import { CommentList } from "@/components/shared/comment-list";
import { TaskDescriptionEditor } from "@/components/editor/task-description-editor";
import { TaskTitleEditor } from "@/components/editor/task-title-editor";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

import FileUpload from "./task-file-upload";

import { Doc } from "@/convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskWithAssignees extends Doc<"tasks"> {
  assignees: string[];
}

interface TaskModalProps {
  task: TaskWithAssignees;
}

export function TaskDetails({ task }: TaskModalProps) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <ScrollArea className="h-screen">
          <div className="grow grid gap-4 auto-rows-min p-4">
            <TaskTitleEditor taskTitle={task.title} taskId={task?._id} />
            <TaskDescriptionEditor
              taskId={task._id}
              content={task.description as string}
            />
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="comments">
                <CommentList parent={task._id} />
              </TabsContent>
              <TabsContent value="files">
                <FileUpload taskId={task._id} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={15}>
        <div className="grid gap-6 auto-rows-min justify-items-start border-l p-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <StatusSelector currentStatus={task.status} taskID={task._id} />
          </div>
          <div className="grid gap-2">
            <Label>Flags</Label>
            <FlagSelector task={task._id} flags={task.flags as []} />
          </div>
          <div className="grid gap-2">
            <Label>Assignees</Label>
            <AssigneeList taskId={task._id} assignees={task.assignees} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="due-date">Due Date</Label>
            <DueDate taskId={task._id} dueDate={task.due_date} />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
