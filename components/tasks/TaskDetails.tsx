"use client";

import { FileEditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { DueDate } from "@/components/shared/due-date";
import { AssigneeList } from "@/components/shared/assignee-list";
import { StatusSelector } from "@/components/shared/status-selector";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { FlagSelector } from "@/components/shared/flag-selector";
import { CommentList } from "@/components/shared/comment-list";

import { Doc } from "@/convex/_generated/dataModel";
import Tiptap from "../Editor";

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
        <div>
          <div className="flex flex-row">
            <h2 className="text-2xl font-bold mr-2">{task?.title}</h2>
            <Button className="w-8 h-8" size="icon" variant="outline">
              <FileEditIcon className="w-4 h-4" />
              <span className="sr-only">Edit task</span>
            </Button>
          </div>
        </div>
        <Tiptap />
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
