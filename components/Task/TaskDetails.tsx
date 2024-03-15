"use client";
import { Label } from "@/components/UI/label";

import { DueDate } from "@/components/shared/due-date";
import { AssigneeList } from "@/components/shared/assignee-list";
import { StatusSelector } from "@/components/shared/status-selector";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/UI/tabs";
import { FlagSelector } from "@/components/shared/flag-selector";
import { CommentList } from "@/components/shared/comment-list";

import { Doc } from "@/convex/_generated/dataModel";
import { TaskDescriptionEditor } from "@/components/Editor/TaskDescriptionEditor";

interface TaskWithAssignees extends Doc<"tasks"> {
  assignees: string[];
}

interface TaskModalProps {
  task: TaskWithAssignees;
}

export function TaskDetails({ task }: TaskModalProps) {
  return (
    <div className="flex gap-4">
      <div className="grow grid gap-4 auto-rows-min">
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
          <TabsContent value="files">Files</TabsContent>
        </Tabs>
      </div>
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
    </div>
  );
}
